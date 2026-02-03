import { connectDB } from "@/src/dbConfig/dbConfig";
import getTokenData from "@/src/helpers/getTokenData";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest){

    await connectDB();

    try {
        
        const reqBody = await request.json();
        const { refreshToken } = reqBody;

        const decodedData: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        const userId = decodedData.tokenData.id;
        const user = await User.findById(userId);

        if(!(user.refreshToken === refreshToken)){
            return NextResponse.json({
                message: "Invalid Refresh Token",
                status: 401
            })
        }

        const accessToken = await user.generateAccessToken();

        const response = NextResponse.json({
            message: "New Access Tokens created successfully",
            status: 200,
            data: user
        })

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true, 
        })

        return response;

    } catch (error: any) {
        return NextResponse.json(
            {error: error?.message},
            {status: 500})
    }
}