"use client";
import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
// import { toast } from "../ui/sonner";
import Link from "next/link";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        // Clear localStorage
        localStorage.removeItem("user"); // Remove the user data

        // Dispatch logout action
        dispatch(logout());

        // Redirect to the home page
        router.push("/");
      })
      .catch((error: any) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <>
      <div
        className={` flex h-screen   flex-col justify-center items-center   rounded-xl    `}
      >
        <div className="bgColor  w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[35%] rounded-xl  py-8 sm:px-8 border-2 hover:border-black   shadow-xl ">
          <h2 className="text-3xl px-8  text-center text-[#7B7B7B] font-extrabold my-12 ">Are you sure you want to Log out? </h2>
          <div className="flex justify-between   xl:px-24" >
            <Link href="/ ">
              <button className="border-2 rounded-lg text-center px-4 py-2   md:px-6  md:py-3 hover:text-white hover:bg-[#68a1ec] border-[#68a1ec] text-[#68a1ec]">
                No
              </button>
            </Link>
            <button
              onClick={logoutHandler}
              className="border-2 rounded-lg text-center   px-4 py-2   md:px-6  md:py-3 hover:text-white  hover:bg-[#68a1ec] border-[#68a1ec] text-[#68a1ec]"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;