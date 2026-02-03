import { connectDB } from "@/src/dbConfig/dbConfig";
import getTokenData from "@/src/helpers/getTokenData";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){

    connectDB();

    try {
        
        const userId = await getTokenData(request);
        const user = await User.findById(userId);

        user.refreshToken = undefined;
        await user.save();

        const response = NextResponse.json({
            message: "User successfully logged out",
            status: 200
        })
        response.cookies.set("accessToken", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;
        
    } catch (error: any) {
        return NextResponse.json({error: error?.message},
            {status:500}
        )
    }
}