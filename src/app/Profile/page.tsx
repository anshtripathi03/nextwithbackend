'use client'
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

    const router = useRouter();
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

    const onLogout = async() => {
        setLoading(true);
        try {
            const res = await axios.post("/api/users/logout", { withCredentials : true })
            console.log(res);
            toast.success("Logout Successfull", {duration: 1500});
            setTimeout(()=>{
                router.push("/login");
            }, 1500)
        } catch (error: any) {
            setError(error?.message || "Log Out Failed")
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        currentUser();
    },[])

    if(loading) return <h1>User Details Loading</h1>;
    if(!user) return <Link href={"/login"} className=" flex flex-col items-center justify-center "> User Not Logged in! <span className=" text-blue-400 ">Click here to Login</span></Link>

    return(
        <div className=" flex h-screen flex-col items-center justify-center bg-blue-200">
            <p className="text-red-500">{error}</p>
            <h1 className=" font-bold text-4xl m-2">Username: <span>{user?.username}</span></h1>
            <h2 className=" font-bold text-2xl m-2">Email: <span>{user?.email}</span></h2>
            <h3 className=" font-semibold text-xl my-1">Verified:<span>{String(user?.isVerified)}</span></h3>
            <h3 className=" font-semibold text-xl my-1">Admin:<span>{String(user?.isAdmin)}</span></h3>
            <button 
            onClick={onLogout}
            className="border-3 rounded-lg my-8 py-1 px-2 text-2xl hover:bg-white"
            >
                Logout
            </button>
        </div>
    );
}