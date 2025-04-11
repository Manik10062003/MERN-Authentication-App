import mongoose from "mongoose";

const connectdb = async () => {
    mongoose.connection.on('connected' , () => console.log('connected to mongodb'));
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
}

export default connectdb;