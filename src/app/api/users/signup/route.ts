import { connectDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { mailer } from "@/src/helpers/email";

connectDB();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({error:"User already exist"}, {status: 400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash("B4c0/\/", salt);

        const newUser = new User({
            username,
            email,
            Password: hashedPassword,
        })

        const savedUser = await newUser.save();
        console.log(savedUser);
        
        await mailer({ mail: savedUser.email, mailtype:"VERIFY", userID:savedUser._id })

        return NextResponse.json({
            message:"User saved successfully",
            status: 400,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message},
        {status:500})
    }
}