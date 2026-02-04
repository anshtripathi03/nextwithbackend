"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users/login", user, {
        withCredentials: true,
      });
      toast.success("Login Successfull", {duration: 1500})
      console.log("Success login call", res.data);
      setTimeout(()=>{
        router.push("/Profile");
      }, 1500)
      setSuccess(true);
    } catch (error: any) {
      setError(error?.message || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSubmit(
      user.username.length > 0 &&
      user.password.length > 0
    );
    setSuccess(false);
  }, [user]);

  return (
    <div className="h-screen w-screen text-white bg-black flex flex-col justify-center items-center">
      <div className=" p-12 bg-gray-600 text-2xl flex gap-10 flex-col items-center justify-center rounded-2xl">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : <h1 className=" font-bold text-3xl">{loading ? (
            "Processing"
          ) : (
            "Login"
          )}</h1>}
          { success ? <p className="text-green-500">"Successfully Logged in!!"</p> : ""}
        <div className=" flex gap-4 items-center justify-center ">
          <label htmlFor="username">Username :</label>
          <input
            value={user.username}
            placeholder="Enter Username"
            type="text"
            id="username"
            className="bg-white rounded-md p-2 text-black"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </div>
        <div className=" flex gap-4 items-center justify-center ">
          <label htmlFor="password">Password :</label>
          <input
            value={user.password}
            placeholder="Enter Password"
            type="password"
            id="password"
            className="bg-white rounded-md p-2 text-black"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="hover:bg-white hover:text-black border-2 py-2 px-6 rounded-lg cursor-pointer "
          onClick={onLogin}
          disabled={!submit}
        >
          Login
        </button>
        <Link href={"/signup"} className="text-base text-gray-100">
          Haven't registered yet? Register here!
        </Link>
      </div>
    </div>
  );
}
