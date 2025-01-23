"use client"
import Custom404 from "../not-found";
import useAuth from "../components/hook/useAuth";
import ExportComponents from "../components/Export";

export default function ThroughHolePage() {

  const {status} = useAuth()
  return status ? (
    <div>
      <ExportComponents />
    </div>
  ) 
  
  : (
    <div>
      <Custom404 />
    </div>
  );
}
