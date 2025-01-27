

"use client"
import React, {  useEffect, useState } from 'react';
import Image from 'next/image';
import menuIcon from '../../../Assets/icons/menu.svg';
import logo from '../../../Assets/icons/i-techlogo 1.svg';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/slices/authSlice';
import useAuth from './hook/useAuth';
const Header: React.FC = () => {


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {status, userData, }= useAuth()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!status) { // Only fetch data if the user is not logged in
            //@ts-ignore
            dispatch(fetchUserData());
        }
    }, [status, dispatch]);
    

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    

    return (
        <>
            <header className="px-6 py-2  sm:px-6 md:px-16 fixed top-0 z-50 bg-white left-0  w-full border-b-2  ">
                <div className='flex     flex-col sm:flex-row justify-between items-center      text-white'>
                    <div className="flex  items-center justify-center gap-2 ">
                        {status &&
                            <Image
                                src={menuIcon}
                                alt="menu"
                                width={20}
                                height={30}
                                onClick={toggleSidebar} // Toggle sidebar on menu click
                                className="cursor-pointer md:w-[40] md:h-[60] "
                            />

                        }

                        <h1 className="font-extrabold xl:text-[2.475rem] md:text-[1.2rem] text-[1rem] text-[#7B7B7B]">
                            Inventory Management System
                        </h1>
                    </div>
                    <div className=' '>
                        <figure>
                            <Image
                            className='w-80 h-16  '
                            src={logo} alt="profile" />
                        </figure>
                    </div>
                </div>
            </header>

            < Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </>
    );
};

export default Header;
