"use client"
import Link from 'next/link'
import React from 'react'

const Header = () => {


  return (
    <div className="">
     <div className="flex justify-between p-2 bg-red-500">
       <div className="">Logo</div>
      <div className="border px-4 py-1 rounded-md bg-blue-700" >
        <Link href={"/sign-up"}>SignUp</Link>
      </div>
     </div>
    </div>
  )
}

export default Header