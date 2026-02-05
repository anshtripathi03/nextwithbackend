"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmail() {
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const searchToken = useSearchParams();
  const query = searchToken.get("token");
  const [error, setError] = useState();
  const [request, setRequest] = useState<{
    token: string | null;
  }>({
    token: null,
  });

  const currentUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/me", { withCredentials: true });
      console.log("user Fetched", res.data);
      setStatus(res.data.data.isVerified);
    } catch (error: any) {
      setError(error?.message || "");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users/verifyemail", request, {
        withCredentials: true,
      });
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setStatus(true);
      setLoading(true);
      toast.success("Email verified", {duration: 1500})
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  useEffect(() => {
    if (query) {
      setRequest({ ...request, token: query });
    }
  }, [query]);

  return (
    <div className=" flex flex-col items-center justify-center bg-black h-screen">
      { error ? <p className="text-red-500">{error}</p> : <button
        onClick={onVerify}
        disabled={status || loading}
        className={` ${ status? 'bg-green-400' : loading? 'bg-orange-400' : 'bg-blue-300 hover:bg-pink-300 '} border-white p-4 text-xl rounded-lg cursor-pointer border-2  `}
      >
        {status? "Verified" :  <h1>{loading ? "Processing" : "Verify Your Email"}</h1> }
      </button>}
    </div>
  );
}
