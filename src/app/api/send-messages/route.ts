import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {   
                    success: false, 
                    message: "User not found"
                },
                { status: 404 }
            );
        }
        //if user is not accepting message
        if(!user.isAcceptingMessages){
            return Response.json(
                {   
                    success: false, 
                    message: "User is not accepting message"
                },
                { status: 403 }
            );
        }
        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}