import mongoose, { ConnectOptions } from "mongoose";

const connect = async () => {
    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGO_URL as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log("Mongo Connection successfully established.");
    } catch (error) {
        throw new Error("Error connecting to Mongoose.");
    } 
};

export default connect;