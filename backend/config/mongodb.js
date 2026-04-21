import mongoose from "mongoose";


const connectDB =async () => {
        mongoose.connection.on('connected',() => console.log("Database Connected") )

        const mongoUri = process.env.MONGODB_URI
        if (!mongoUri) {
                throw new Error('MONGODB_URI is missing in environment variables')
        }

        await mongoose.connect(mongoUri)
}

export default connectDB