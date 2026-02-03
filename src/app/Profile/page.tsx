'use client'
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function profile(){

    interface User {
        username:string,
        email:string,
        password:string,
        isVerified:Boolean,
        isAdmin:Boolean,
        forgotPasswordToken:String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
        refreshToken: String
    }

    const [user, setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState();

    const currentUser = async() => {
        
        setLoading(true);
        try {
            const res = await axios.get("/api/users/me", {withCredentials: true})
            console.log("user Fetched", res.data);
            setUser(res.data.data);
        } catch (error: any) {
            setError(error?.message || "");
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        currentUser();
    },[])

    if(loading) return <h1>User Details Loading</h1>;

    return(
        <div>
            <h1>{user?.username}</h1>
            <h2>{user?.email}</h2>
            <h3>Verified:<span>{String(user?.isVerified)}</span></h3>
            <h3>Admin:<span>{String(user?.isAdmin)}</span></h3>
        </div>
    );
}