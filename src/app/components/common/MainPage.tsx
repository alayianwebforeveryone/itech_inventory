import React, { useEffect, useState } from "react";
import Image from "next/image";
import search from "../../../../Assets/icons/search.svg";
import addCompServices from "../../appwrite/componentService";
import CardComp from "./CompCard";
import AddComponents from "../Add Component";
import useAuth from "../hook/useAuth";
import { SkeletonCard } from "./SkeletonCard";
import { FaChevronUp } from "react-icons/fa";



const MainComp: React.FC = () => {
   const [showModal, setShowModal] = useState(false);
   const [category, setCategory] = useState("");
   const [query, setQuery] = useState("");
   const [components, setComponents] = useState<any[]>([]); // State to hold all fetched components
   const [filteredComponents, setFilteredComponents] = useState<any[]>([]); // State to hold filtered components based on search
   const { userData } = useAuth()
   const [isLoading, setIsLoading] = useState(true);

   // Fetch all components on mount
   useEffect(() => {
      const fetchComponents = async () => {
         try {
            const allComponents = await addCompServices.getAllComp(); // Fetch all components
            const sortedComponents = allComponents.sort(
               (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setComponents(sortedComponents); // Set all components
            setFilteredComponents(sortedComponents); // Initially show all components
         } catch (error) {
            console.error("Error fetching components:", error);
         }
      };

      fetchComponents();
   }, []);

   // Apply search and category filters dynamically
   useEffect(() => {
      const fetchComponents = async () => {
         setIsLoading(true); // Set loading to true before fetching
         try {
            const allComponents = await addCompServices.getAllComp();
            const sortedComponents = allComponents.sort(
               (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setComponents(sortedComponents);
            setFilteredComponents(sortedComponents);
         } catch (error) {
            console.error("Error fetching components:", error);
         } finally {
            setIsLoading(false); // Set loading to false after fetching
         }
      };

      fetchComponents();
   }, []);

   useEffect(() => {
      let filtered = components;
      if (query.trim() !== "") {
         filtered = filtered.filter((comp) =>
            comp.name.toLowerCase().includes(query.toLowerCase())
         );
      }
      if (category !== "") {
         filtered = filtered.filter((comp) => comp.category === category);
      }
      setFilteredComponents(filtered);
   }, [query, category, components]);

   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategory(e.target.value);
   };
   // Handle search query
   const handleSearch = async () => {
      if (query.trim() === "") {
         setFilteredComponents(components); // Show all components if the search query is empty
      } else {
         try {
            const filtered = components.filter(comp =>
               comp.name.toLowerCase().includes(query.toLowerCase()) // Assuming you want to filter based on component name
            );
            setFilteredComponents(filtered); // Update state with filtered data
         } catch (error) {
            console.error("Error filtering components:", error);
         }
      }
   };

   return (
      <div className="bgColor relative  pt-[105px] sm:pt-[80px] customPadding md:pt-[80px] lg:pt-[80px] ">
         <AddComponents isVisible={showModal} close={() => setShowModal(false)} />
         <div className="flex flex-col md:flex-row fixed shadow-md bg-white z-20 w-[100%] pt-2  md:pt-2 pb-2   border-b-2      justify-between px-8  md:px-16 items-center">
            <div className="font-extrabold w-full bg-gray-200 flex md:w-[40%] lg:w-[60%] justify-between py-1  text-[#7B7B7B] rounded-xl px-4 ">
               <input
                  className="bg-gray-200 w-[80%] py-1 focus:outline-none"
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
               />
               <figure className="w-[10%] flex justify-end cursor-pointer">
                  <Image onClick={handleSearch} src={search} alt="search" />
               </figure>
            </div>

            <div className={`md:w-[60%]  lg:w-[40%] flex-col md:flex-row w-full mt-2 md:mt-0 justify-end flex ${userData.name === "Admin" ? "justify-end]" : "justify-end"} gap-2`}>
               <div className="relative w-[100%] md:w-[40%] ">
                  <select
                     id="category"
                     onChange={handleCategoryChange}
                     className="w-[100%]  bg-gray-200 px-2 appearance-none  py-2 focus:outline-none rounded-lg"
                  >
                     <option label="All" />
                     <option value="SMD">SMD</option>
                     <option value="Through hole">Through Hole</option>
                     <option value="Others">Others</option>
                  </select>
                  <span className="absolute right-[12px] top-[22px] transform -translate-y-1/2 text-black  pointer-events-none">
                     <FaChevronUp />
                  </span>

               </div>

               {userData.name === "Admin" && (
                  <div onClick={() => setShowModal(true)} className="px-3 py-2  secondaryColor text-white rounded-lg">
                     <button>Add new Component</button>
                  </div>
               )}
            </div>
         </div>

         <div className=" pt-40 md:pt-32 bg-white   rounded-xl">
            {isLoading ? (
               // Skeleton loader
               <SkeletonCard />
            ) : filteredComponents.length > 0 ? (
               <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-x-4 pb-16 gap-y-12 justify-items-end  px-8 md:px-12  ">
                  {filteredComponents.map((comp, index) => (
                     <CardComp Cardkey={index} data={comp} />
                  ))}
               </div>
            ) : (
               <div className="flex items-center justify-center w-full py-48">
                  <p className="font-bold text-xl md:text-[2.7rem] text-center text-[#2171B6]">
                     No components Found
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default MainComp;
