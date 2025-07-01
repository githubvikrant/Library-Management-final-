import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () =>{
   
    cron.schedule("*/30 * * * *", async () => {
      
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers =await Borrow.find({
            returnDate: {
                $lt: oneDayAgo,
            },
            returnedAt: null,
            notified: false,
        });

        for( const element of borrowers){
            if(element.user && element.user.email){
                sendEmail({
                    email:element.user.email,
                    subject: "Book Return Remainder.",
                    message: `Hello ${element.user.name},\n\nThis is a remainder that the you borrowed is due for return today.Please return the book as soon as possible.\n\n Thank you. `
                });

                element.notified = true;
                await element.save();
                // console.log(`Email sent to ${element.user.email}`);
            }
        }
        } catch (error) {
            console.error("Some error occured in notifying Users.",error);
            
        }
    });
}