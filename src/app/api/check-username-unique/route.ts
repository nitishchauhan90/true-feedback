import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request:Request){
    await dbConnect();
    try {
        // console.log(request.url);
        const {searchParams} = new URL(request.url);
        // console.log("Search Params", searchParams);
        const queryParams = {
            username: searchParams.get('username'),
        };
        const result = UsernameQuerySchema.safeParse(queryParams); //checking zod validation
        // console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
              {
                success: false,
                message:
                  usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid query parameters',
              },
              { status: 400 }
            );
        } // yaha tak validation kerne ke baad check kre kahi ye nam database me to nahi hai
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingVerifiedUser) {
            return Response.json(
              {
                success: false,
                message: 'Username is already taken',
              },
              { status: 200 }
            );
        }
      
        return Response.json(
            {
              success: true,
              message: 'Username is unique',
            },
            {  status: 200 }
        );


    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
        {
            success: false,
            message: 'Error checking username',
        },
        { status: 500 }
        );
    }
}