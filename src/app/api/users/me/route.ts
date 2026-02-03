import { connectDB } from "@/src/dbConfig/dbConfig";
import getTokenData from "@/src/helpers/getTokenData";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

    await connectDB();

    try {
        
        const userId = await getTokenData(request);
        const user = await User.findById(userId).select("-password");

        return NextResponse.json({
            message: "User fetched successfully",
            status: 200,
            data: user
        })

    } catch (error: any) {

        return NextResponse.json(
            {error: error?.message},
            {status: 500}
        )

    }
}