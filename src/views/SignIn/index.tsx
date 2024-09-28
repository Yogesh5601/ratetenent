"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/apiHelper/signIn";
import Link from "next/link";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSignIn = async () => {
    setError(""); // Clear previous errors

    // Form validation
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      const params = { username, password };
      const response = await signInUser(params);

      console.log("Sign-in response:", response);

      if (response?.data?.success === true) {
        localStorage.setItem("username", username);
        router.push("/"); // Redirect to the home page
      } else {
        setError(response?.data?.message || "Sign-in failed. Please try again.");
      }
    } catch (error) {
      setError("Sign-in failed. Please try again.");
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-black w-full flex flex-col items-center p-4 text-black">
      <h2 className="text-white mb-4">Sign In</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <input
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleSignIn}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Signing In..." : "Sign In"} {/* Show loading text */}
      </button>
      <div className="text-white flex gap-2">
        <p>Don't have an account?</p>
        <Link href="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
