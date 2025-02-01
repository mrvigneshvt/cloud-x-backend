import mongoose from "mongoose";
import { configDatas } from "../../config";
import { userModel } from "./model";

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(configDatas.MongoUri.apiUrl);

    if (!connection) {
    }
  } catch (error) {}
};

class DataBase {
  private mongo;

  constructor(mongoUri: string) {
    this.mongo = mongoUri;
  }

  public async connectDB(): Promise<Boolean> {
    try {
      await mongoose.connect(this.mongo);
      return true;
    } catch (error) {
      console.log("error in db Connection::", error);
      return false;
    }
  }

  public async isUserExist(id: string): Promise<Boolean> {
    try {
      const user = await userModel.findOne({ userId: id });

      return user ? true : false;
    } catch (error) {
      console.log("error in UserExist::", error);

      return false;
    }
  }

  public async createUser(id: string) {
    try {
      const createUser = await userModel.create({ userId: id });
    } catch (error) {}
  }
}
