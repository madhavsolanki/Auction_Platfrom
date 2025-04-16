import mongoose from "mongoose";


// Connect Mongodb
const connection = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI)

     console.log('Connected to Database');
     
  } catch (error) {
    console.log(`Erorr in connecting with Database ${error.messsage}`);
    process.exit(1);
  }
}

export default connection;