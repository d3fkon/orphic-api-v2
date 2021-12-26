import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VisitHistory,
  VisitHistoryDocument,
} from '../schemas/visit-history.schema';

/**
 * A service built to track the visit history of customers
 */
@Injectable()
export class VisitHistoryService {
  constructor(
    @InjectModel(VisitHistory.name)
    private readonly userModel: Model<VisitHistoryDocument>,
  ) {}
  /**
   * Service method to track the users in the system
   * @param userId The user to be logged
   * @param clientId The client to tag the user with
   * TOOD: Implement analysis and other methods
   */
  track(userId: string, clientId: string) {
    return this.userModel.create({
      user: userId,
      clientId: clientId,
    });
  }
}
