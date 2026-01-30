import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,"Please provide a username"],
        unique:[true],
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique:[true],
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    forgotPasswordToken:{
        type: String,
    },
    forgotPasswordTokenExpiry:{
        type: Date,
    },
    verifyToken:{
        type: String,
    },
    verifyTokenExpiry:{
        type: Date
    },
    refreshToken:{
        type: String
    },
})

userSchema.methods.generateAccessToken = async function(){

    const tokenData = {
        id: this._id,
        username: this.username,
        email: this.email
    }

    return jwt.sign(
        {tokenData},
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "1h"}
    )
}

userSchema.methods.generateRefreshToken = async function(){
   const tokenData = {
        id: this._id,
        username: this.username,
        email: this.email
    }
    
    return jwt.sign(
        {tokenData},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "1d"}
    )
}

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User