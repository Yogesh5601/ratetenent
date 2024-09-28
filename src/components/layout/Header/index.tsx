"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {

    console.log("LocalStorage Data:", localStorage);
    // Check for localStorage only on the client-side
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!username);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // Update state
    router.push("/sign-up"); // Redirect to the sign-up page
  };

  return (
    <div className="bg-red-500 p-2">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold">Logo</div>
        <div className="space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border px-4 py-1 rounded-md bg-blue-700 text-white"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="border px-4 py-1 rounded-md bg-blue-700 text-white"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
