import { connectDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){

    await connectDB();

    try {
        
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                message: "User does not exist",
                status: 400
            })
        }
        console.log("User exists");

        const validpassword = await bcrypt.compare(password, user.password);
        if(!validpassword){
            return NextResponse.json({
                message: "Invalid Password",
                status: 401
            })
        }
        console.log(user);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        const response = NextResponse.json({
            message: "User Successfully Logged In",
            status: 200
        })

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error?.message},
        {status: 500})
    }
}