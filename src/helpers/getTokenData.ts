import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export default function getTokenData(request: NextRequest){
    
    try {
        
        const token = request.cookies.get("accessToken")?.value || "";
        const decodedTokenData: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
        return decodedTokenData.id;

    } catch (error: any) {

        return NextResponse.json({error: error?.message},
            {status:500}
        )

    }
}