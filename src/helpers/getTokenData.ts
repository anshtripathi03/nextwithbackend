import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export default async function getTokenData(request: NextRequest) {

  const token = request.cookies.get("accessToken")?.value || "";

  if (!token) {
    throw new Error("Access token missing");
  }

  const decodedTokenData: any = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
  );

  return decodedTokenData.tokenData.id;

}
