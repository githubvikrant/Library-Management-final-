import cron from "node-cron";
import User from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  // Run every 5 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);


      const deletedUsers = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: twentyMinutesAgo },
      });
      // console.log(`Deleted ${deletedUsers.deletedCount} unverified accounts.`);
    } catch (error) {
      console.error("Error deleting unverified accounts:", error);
    }
  });
};
