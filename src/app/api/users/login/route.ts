import { connectDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export default async function POST(request: NextRequest){

    connectDB();

    try {
        
        const reqBody = await request.json();
        const { username, password} = reqBody;

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

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save();

        const responce = NextResponse.json({
            message: "User Successfully Logged In",
            status: 200
        })

        responce.cookies.set("accessTokens", accessToken, {
            httpOnly: true
        })

        return responce;

    } catch (error: any) {
        return NextResponse.json({error: error?.message},
        {status: 500})
    }
}