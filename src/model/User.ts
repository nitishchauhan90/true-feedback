import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{    // used in typescript to define the type of message schema to avoid mistake 
    content:string,
    createdAt:Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        required:true
    }
})

export interface User extends Document{     
    username:string;
    email:string; 
    password: string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages:Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username can not be empty."],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Username can not be empty."],
        unique:true,  
        // match:[/.+\@.+\..+ /, 'please use a valid email address']  //regix used from chatgpt to verify email address 
    },
    password:{
        type:String,
        required:[true,"Password is required."],
    },
    verifyCode: {
        type:String,
        required:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]  //array of Message so ALL field of MessageSchema
}) 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))
export default UserModel;