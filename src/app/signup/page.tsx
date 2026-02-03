"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Signup() {
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [submit, setSubmit] = useState(false);
  const router = useRouter();

  const onSignup = async () => {
    setLoading(true);
    console.log("Started");
    try {
      const response = await axios.post("/api/users/signup", user, {
        withCredentials: true,
      });
      console.log("success", response.data);
      router.push("/login");
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSubmit(
      user.username.length > 0 &&
        user.email.length > 0 &&
        user.password.length > 0,
    );
  }, [user]);

  return (
    <div className="h-screen w-screen text-white bg-black flex flex-col justify-center items-center">
      <div className=" p-12 bg-gray-600 text-2xl flex gap-10 flex-col items-center justify-center rounded-2xl">
        <h1>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : loading ? (
            "Processing"
          ) : (
            "Signup"
          )}
        </h1>
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
          <label htmlFor="email">Email :</label>
          <input
            value={user.email}
            placeholder="Enter Email"
            type="text"
            id="email"
            className="bg-white rounded-md p-2 ml-12 text-black"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
          className=" border-2 py-2 px-6 rounded-lg cursor-pointer "
          onClick={onSignup}
          disabled={!submit}
        >
          Register
        </button>
        <Link href={'/login'} className="text-base text-gray-100">Already registered? Login here!</Link>
      </div>
    </div>
  );
}
