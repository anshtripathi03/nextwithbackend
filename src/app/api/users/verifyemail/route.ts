import { connectDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){

    connectDB();

    try {
        
        const reqBody = await request.json();
        const {token} = reqBody
        console.log(token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: ({$gt: Date.now()})
        })

        if(!user){
            return NextResponse.json({error: "Invalid Token"},
                {status: 401}
            )
        }

        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        user.isVerified = true;

        await user.save({ validateBeforeSave: true});

        const responce = NextResponse.json({
            message: "User Email verfied successfully",
            status: 200
        })

        return responce;

    } catch (error: any) {
        return NextResponse.json({error: error?.message},
            {status: 500}
        )
    }
}