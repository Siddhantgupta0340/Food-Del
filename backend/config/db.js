import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://siddhantgupta0304_db_user:sid0304@cluster0.0tjim0b.mongodb.net/Food-Del').then(() => {
        console.log('Connected to MongoDB');
    })
}