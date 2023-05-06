import mongoose from 'mongoose';

export const connect = async() => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(process.env.MONGODB_URL, connectionParams);
        console.log("connected to database");
    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
    }
}
