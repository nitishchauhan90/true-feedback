import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials: {
                email: { label: "email", type: "text", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                await  dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or:[        //mongoose function or used to check to field together
                            {
                                email: credentials.identifier, //not identifiers
                            },
                            {
                                username: credentials.identifier,
                            }
                        ]
                        
                    })
                    // console.log(credentials.identifier)
                    if(!user){
                        throw new Error ('NO user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error ('Please verify your account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password); 
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error ('incorrect password')
                    }
                }catch(err:any){
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString() //typescript error so we have to define the interface of session and user to take values
                token.isVerified = user.isVerified ;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {  //token aur session me data dal diya hai taki bar bar database ko disturbe na kerna pde
            if(token){
                session.user._id=token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.username=token.username;
            }
            return session
        },
      
    },
    pages:{
        signIn:'/sign-in',
    },
    session:{
        strategy:'jwt',
    },
    secret:'anything',   //secret key for jwt token   process.env.NEXTAUTH_SECRET
}