"use client";

import MainComp from "./components/common/MainPage";
import useAuth from "./components/hook/useAuth";
import Login from "./components/Login";
import {  Puff } from 'react-loader-spinner'

export default function HomePage() {
  const { status, isLoading } = useAuth();

  if (isLoading) {
    return <div className=" h-screen flex justify-center items-center ">
      <Puff
        visible={true}
        height="80"
        width="80"
        color="#3B82F6"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>;
  }


  if (status) {
    return <MainComp />;
  } else {
    return <Login />;
  }
}
