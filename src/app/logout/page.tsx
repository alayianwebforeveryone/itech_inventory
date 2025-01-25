"use client"
import Custom404 from "../not-found";
import useAuth from "../components/hook/useAuth";
import Logout from "../components/Logout";

export default function ThroughHolePage() {

  const {status} = useAuth()
  return status ? (
    <div>
      <Logout />
    </div>
  ) 
  
  : (
    <div>
      <Custom404 />
    </div>
  );
}
