"use client";
import React, { useState } from "react";
import { signUpUser } from "@/apiHelper/signUp";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUP = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("tenant"); // Default role is "tenant"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e:any) => {
    e.preventDefault(); // Prevent default form submission
    setError("");

    // Basic form validation
    if (!username || !email || !password || !confirmPassword || !role) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const params = { username, email, password, role }; // Include email in the parameters
      const response = await signUpUser(params);

      console.log("Sign-up response:", response);

      if (response?.data?.success === true) {
        router.push("/sign-in");
      } else {
        setError(response?.data?.message || "Sign up failed");
      }
    } catch (error) {
      setError("Sign-up failed. Please try again.");
      console.error("Sign-up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-full flex flex-col items-center p-4 text-black">
      <h2 className="text-white mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col gap-2 w-full max-w-xs" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email" // Change type to email
          placeholder="Email"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Role selection */}
        <select
          className="p-2 border border-gray-300 rounded outline-none"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>

        <button
          type="submit"
          className={`mt-4 p-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="text-white flex gap-2">
        <p>Already have an account?</p>
        <Link href="/sign-in" className="text-blue-500">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUP;
