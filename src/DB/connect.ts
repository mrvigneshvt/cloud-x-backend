import mongoose from "mongoose";
import { configDatas } from "../../config";
import { userModel } from "./model";
import { errorLogger } from "../../ERROR-LOGGER/errorLogger";

export default class DataBase {
  private mongo;

  constructor(mongoUri: string) {
    this.mongo = mongoUri;
  }

  public async connectDB(): Promise<Boolean | unknown> {
    try {
      await mongoose.connect(this.mongo);
      return true;
    } catch (error) {
      errorLogger('error in db Connection::"', error);
      throw new Error("Cant be Able to Connect to DB !@! shutting DOWN");
    }
  }

  public async getUser(uniqueNumber: string) {
    try {
      return await userModel.findOne({ userId: uniqueNumber });
    } catch (error) {}
  }

  public async isUserExist(unqiueNumber: string): Promise<Boolean> {
    try {
      const user = await userModel.findOne({ userId: unqiueNumber });

      user ? true : await this.createUser(unqiueNumber);

      return true;
    } catch (error) {
      errorLogger("error in UserExist::", error);

      return false;
    }
  }

  private async createUser(unqiueNumber: string): Promise<Boolean> {
    try {
      await userModel.create({ userId: unqiueNumber });

      return true;
    } catch (error) {
      return false;
    }
  }

  public async handleSearchQuery(unqiueNumber: string, query: string) {
    try {
      console.log("handling search in db");
      await userModel.findOneAndUpdate(
        { userId: unqiueNumber },
        {
          $push: {
            searchHistory: query,
          },
        },
      );
    } catch (error) {
      errorLogger("error in mongo handleSearchQuery::", error);
    }
  }

  public async handleMovieLookUp(unqiueNumber: string, movieId: string) {
    try {
      console.log("handling Movie");
      await userModel.findOneAndUpdate(
        { userId: unqiueNumber },
        {
          $push: {
            watchHistoryMovie: {
              movieId,
              watchedAt: new Date(),
            },
          },
        },
      );
    } catch (error) {
      errorLogger("error in Movielookup", error);
    }
  }
}
