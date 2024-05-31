import mongoose from "mongoose";

type ConnetionObject ={
    isConnected?: number     //connection complete hone pe ek no return hoga use define kiya hai
}

const connection: ConnetionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }  
    try{
        // const db=await mongoose.connect(process.env.MONGODB_URI || '',{});
        const db=await mongoose.connect('mongodb+srv://nitishchauhan9090:z4nukbaBFqx7rYN5@cluster0.ajdjxlu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' || '',{});
        connection.isConnected=db.connections[0].readyState;  //connection ke baad ek number return krega usko liya hai
        // console.log(db);
        // console.log(db.connections[0].readyState);
        // console.log(db.connections);
        console.log("DB Connected Successfully");
    }  catch(error){
        console.log("DB Connection is Failed",error);
        process.exit(1);
    }
}

export default dbConnect;
