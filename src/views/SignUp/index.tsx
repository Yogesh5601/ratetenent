"use client";
import React, { useState } from "react";
import { signUpUser } from "@/apiHelper/signUp";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUP = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const handleSignUp = async () => {
    try {
      const params = { username, password };
      const response = await signUpUser(params)
      console.log("Sign-up response:", response);

      if(response?.data?.success === true){
        router.push("/sign-in")
      }
        setError(response?.data?.message || "sign up failed")
      
      
    } catch (error) {
      setError("Sign-up failed. Please try again.");
      console.error("Sign-up error:", error);
    }
  };

 

  return (
    <div className="bg-black w-full flex flex-col items-center p-4 text-black">
      <h2 className="text-white mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <input
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleSignUp}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Sign Up
      </button>
      <div className="text-white flex gap-2">
        <p>If already have an account </p>
        <Link href={"/sign-in"} className="text-blue-500" >Sign In</Link>
      </div>
    </div>
  );
};

export default SignUP;
