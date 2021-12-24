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

  async createReward(
    userId: string,
    percentage: number,
    tier: number,
    clientId: string,
  ) {
    return this.rewardModel.create({
      user: userId,
      discountPercentage: percentage,
      code: this.generateCode(),
      expires: new Date(moment().add(2, 'month').toISOString()),
      tier,
      clientId,
    });
  }

  async getRewardsForUser(userId: string, clientId: string): Promise<Reward[]> {
    return this.rewardModel.find({
      user: userId,
      clientId: clientId,
    });
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
    const reward1 = await this.createReward(userId, 20, 1, clientId);
    const reward2 = await this.createReward(userId, 15, 2, clientId);
    const reward3 = await this.createReward(userId, 30, 3, clientId);
    return {
      newlyAlloted: true,
      rewards: [reward1, reward2, reward3],
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
