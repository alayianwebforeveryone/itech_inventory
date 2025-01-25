import React, { use, useState } from 'react';
import Image from 'next/image';
import closeIcon from '../../../../Assets/icons/close.svg'; // Add a cross icon for closing the sidebar

import dashboardIcon from '../../../../Assets/icons/dashboard.svg';
import addIcon from '../../../../Assets/icons/add.svg';
import exportIcon from '../../../../Assets/icons/export.svg';
import logoutIcon from '../../../../Assets/icons/logout.svg';
import Link from 'next/link';
import Logo from '../common/Logo';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import AddComponents from '../Add Component';
import ExportComponents from '../Export';
import useAuth from '../hook/useAuth';


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {


    // state for modal
    const [showModal, setShowModal] = useState(false);
    const [showModalExport, setShowModalExport] = useState(false)
    // const currentUser = useSelector((state: any) => state.auth.userData?.name)
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const { userData, } = useAuth()






    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full z-50 sm:w-[45%] w-[100%] md:w-[43%] xl:w-[28%]  2xl:w-[23%]  lg:pl-6 lg:w-[32%] bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <Logo width={180} height={150} />
                    <Image
                        src={closeIcon}
                        alt="close"
                        width={20}
                        height={20}
                        onClick={onClose}
                        className="cursor-pointer"
                    />
                </div>
               
            <ul className="p-4 flex flex-col space-y-8">
                <Link
                    href="/"
                    onClick={onClose} // Close sidebar on click
                    className={`block px-4 md:text-lg text-md py-2 text-sm border-b rounded hover:bg-[#36a5eb] hover:text-white ${pathname === '/' ? 'font-bold text-white bg-[#36a5eb]' : ''
                        }`}
                >
                    <li>
                        <div className="flex items-center space-x-4">
                            <Image src={dashboardIcon} alt="dashboard" width={20} height={20} />
                            <span className="md:text-xl text-md">{userData?.name} Dashboard</span>
                        </div>
                    </li>
                </Link>

                <Link
                    href="/export"
                    onClick={onClose} // Close sidebar on click
                    className={`cursor-pointer ${pathname === '/export' ? 'font-bold text-white bg-[#36a5eb]' : ''
                        }`}
                >
                    <div
                        className={`flex items-center px-4 border-b py-2 justify-between hover:bg-[#36a5eb] hover:text-white hover:font-bold`}
                    >
                        <div className="flex items-center space-x-4">
                            <Image src={exportIcon} alt="export" width={20} height={20} />
                            <span className="md:text-xl text-md">Export</span>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/logout"
                    onClick={onClose} // Close sidebar on click
                    className={`cursor-pointer ${pathname === '/logout' ? 'font-bold text-white bg-[#36a5eb]' : ''
                        }`}
                >
                    <div
                        className={`flex items-center px-4 border-b py-2 justify-between hover:bg-[#36a5eb] hover:text-white hover:font-bold`}
                    >
                        <div className="flex items-center space-x-4">
                            <Image src={logoutIcon} alt="logout" width={20} height={20} />
                            <span className="md:text-xl text-md">Logout</span>
                        </div>
                    </div>
                </Link>
            </ul>

        </div >
            {/* Overlay */ }
    {
        isOpen && (
            <div
                className="fixed top-0 z-50 sm:left-[45%] left-[100%] md:left-[43%] lg:left-[32%] xl:left-[28%]  2xl:left-[23%]   h-full right-0 bg-black/25"
                onClick={onClose}
            ></div>
        )
    }
    {/* add componrnts modal  */ }
    <AddComponents
        isVisible={showModal}
        close={() => setShowModal(false)}
    />
        </>
    )



};

export default Sidebar;
