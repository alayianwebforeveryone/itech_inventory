
import React, { useState } from "react";
import Image from "next/image";
import EditComponents from "../Edit Component";
import DeleteModal from "../Delete Modal/DeleteModal";
import useAuth from "../hook/useAuth";
// import { usePathname } from "next/navigation";


interface CompCardProps {
  Cardkey: any,
  data: {
    $id: string;
    name: string;
    quantity: number;
    category: string;
    location: string;
    imageUrl: string;
  };
}


const CompCard: React.FC<CompCardProps> = ({ Cardkey, data }: CompCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const { userData } = useAuth()


  return (
    <div
      className={`bg-gray-200 hover:border hover:border-black border shadow-lg rounded-xl custom-style w-full px-3 text-black py-3  `}
      
    >
      <figure className="relative w-full h-[300px]"> {/* Explicit height for the image */}
        <Image
          key={Cardkey}
          className="rounded-lg object-cover"
          src={data.imageUrl}
          alt="components"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>

      <div className="mx-auto mb-2 bg-blue-500 mt-8 py-1">
        <h2 className="text-[1.7rem] font-bold uppercase text-center text-white">
          {data.name}
        </h2>
      </div>
      <div className="flex justify-between md:px-4 sm:px-16 mt-10">
        <ul className="flex flex-col space-y-4 decoration-none">
          <li>Quantity:</li>
          <li>Category:</li>
          <li>Location:</li>
        </ul>
        <div className="flex flex-col space-y-3">
          <p className="font-bold text-xl">{data.quantity}</p>
          <p className="font-bold text-xl">{data.category}</p>
          <p className="font-bold text-xl">{data.location}</p>
        </div>
      </div>

      {userData.name === "Admin" && (
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            onClick={() => setShowModal(true)}
            className="py-1 secondaryColor text-white px-4 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => setShowModalDelete(true)}
            className="text-[#FF1818] border border-[#FF1818] px-3 py-1 rounded-lg"
          >
            Delete
          </button>

          <DeleteModal
            close={() => setShowModalDelete(false)}
            compId={data.$id}
            isVisible={showModalDelete}
          />
        </div>
      )}

      <EditComponents
        close={() => setShowModal(false)}
        isVisible={showModal}
        existingData={data}
      />
    </div>

  );
}
export default CompCard;