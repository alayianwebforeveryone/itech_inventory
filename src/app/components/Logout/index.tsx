"use client";

import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = () => {
    toast.promise(
      authService.logout().then(() => {
        // Clear localStorage
        localStorage.removeItem("user");
  
        // Dispatch logout action
        dispatch(logout());
  
        // Redirect to the home page
        router.push("/");
      }),
      {
        pending: {
          render: "Logging out...",
          style: {
            color: "#3B82F6",
            fontWeight: "bold",
             border: "1px solid blue"
          },
        },
        success: {
          render: "Logout successful! ",
          style: {
            color: "#3B82F6",
            fontWeight: "bold",
             border: "1px solid blue"
          },
        },
        error: {
          render: "Something went wrong. Please try again.",
          style: {
            background: "", // Red background
            color: "red",
            fontWeight: "bold",
          },
        },
      }
    );
  };
  

  return (
    <div className="flex h-screen flex-col justify-center items-center rounded-xl">
      <div className="bgColor w-[80%] sm:w-[60%] md:w-[60%] lg:w-[50%] xl:w-[40%] rounded-xl px-4 py-8 sm:px-8 border-2 hover:border-black shadow-xl">
        <h2 className="text-xl text-center text-[#7B7B7B] font-semibold md:font-bold md:text-3xl my-12">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-between px-8 sm:px-16 xl:px-32">
          <Link href="/">
            <button   className=" bg-white border-2 rounded-lg text-black    hover:text-white  px-4 py-2  hover:bg-blue-600 ">
              No
            </button>
          </Link>
          <button
            onClick={logoutHandler}
             className=" bg-blue-500 text-white rounded-lg   border-2 hover:text-white  px-4 py-2  hover:bg-blue-600 "
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
