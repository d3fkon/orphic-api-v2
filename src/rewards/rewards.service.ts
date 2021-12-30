import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { IExistingRewardsForUser } from './entities/existing-rewards';
import { Reward, RewardDocument } from './schemas/reward.schema';

/**
 * 1. Create a rewards for a user
 * 2. Redeem a reward with an ID
 * 3. Fetch rewards for a user
 * 4. Reward Redemption Statistics
 */

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  generateCode(): string {
    const nanoId1 = customAlphabet('ABCDEFGHIJKLMNOPQR', 3);
    const nanoId2 = customAlphabet('123456789', 3);
    return `${nanoId1()}-${nanoId2()}`;
  }

  /**
   * A helper function to create rewards for users
   * @param userId
   * @param percentage
   * @param tier
   * @param clientId
   * @returns
   */
  async createReward(
    userId: string,
    percentage: number,
    tier: number,
    clientId: string,
    validFromDate: moment.Moment,
  ) {
    return this.rewardModel.create({
      user: userId,
      discountPercentage: percentage,
      code: this.generateCode(),
      eligibleFrom: validFromDate.startOf('day').toISOString(),
      expires: new Date(
        validFromDate.add(20, 'day').startOf('day').toISOString(),
      ),
      tier,
      clientId,
    });
  }

  /**
   *
   * @param userId The user who needs to get the reward
   * @param clientId The client for which the user needs the reward
   * @returns List of rewards
   */
  async getRewardsForUser(userId: string, clientId: string): Promise<Reward[]> {
    const rewards = await this.rewardModel
      .find({
        user: userId,
        clientId: clientId,
      })
      // Adding lean so the message can be tacked on
      .lean();
    const now = moment();
    let messageApplied = false;
    let count = 0;
    let rewardNotApplicableToday = false;
    for (const reward of rewards) {
      count++;
      if (!messageApplied) {
        if (!reward.isRedeemed) {
          const rewardDate = moment(reward.createdAt);
          messageApplied = true;
          // If the reward is on the same day as the user's visit
          if (rewardDate.isSame(now, 'day')) {
            reward.message = `Flat ${reward.discountPercentage}% off on your next visit`;
            rewardNotApplicableToday = true;
          } else {
            reward.message = `Flat ${reward.discountPercentage}% off. Avail Now!`;
          }
        }
        // Reward has been redeemed
        else {
          reward.message = `Congrats on your ${reward.discountPercentage}% discount!`;
        }
        // If message is not applied on the latest offer
      } else {
        if (rewardNotApplicableToday) {
          reward.message = `Flat ${reward.discountPercentage}% off on your visit after that`;
        } else {
          rewardNotApplicableToday = true;
          reward.message = `Flat ${reward.discountPercentage}% off, next visit`;
        }
      }
    }
    return rewards;
  }

  // Check if the user has rewards and accordingly allot new ones if not
  async checkAndIssueRewards(
    userId: string,
    clientId: string,
  ): Promise<IExistingRewardsForUser> {
    const rewards = await this.getRewardsForUser(userId, clientId);

    // If the user already has rewards and check the latest tier
    if (rewards.length > 0) {
      let latestTier = 1;
      for (const reward of rewards) {
        if (!reward.isRedeemed) break;
        if (reward.tier > latestTier && reward.isRedeemed) {
          latestTier = reward.tier;
        }
      }
      return {
        newlyAlloted: false,
        rewards,
        currentTier: latestTier,
      };
    }
    await this.createReward(userId, 25, 1, clientId, moment().add(2, 'day'));
    await this.createReward(userId, 15, 2, clientId, moment().add(4, 'day'));
    await this.createReward(userId, 30, 3, clientId, moment().add(6, 'day'));
    return {
      newlyAlloted: true,
      rewards: await this.getRewardsForUser(userId, clientId),
      currentTier: 1,
    };
  }

  // Redeem the code given and mark as redeemed
  async redeemCode(code: string) {
    return this.rewardModel.findOneAndUpdate(
      {
        code,
      },
      {
        isRedeemed: true,
        redeemedOn: new Date(moment().toISOString()),
      },
    );
  }
}
