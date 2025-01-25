

"use client"
import addCompServices from '@/app/appwrite/componentService';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';




interface DeleteModalProps {
    isVisible: boolean;
    close: () => void;
    compId: any
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isVisible, close, compId }) => {
    const router = useRouter()

    // handle on rest space click
    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === "container") close();
    };
    

    // disabling bg scrollign

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = ""; // Restore scrolling
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);

    if (!isVisible) return null; // Do not render if not visible

    const handleDelete = async () => {
        try {
            await toast.promise(
                addCompServices.deleteComp(compId),
                {
                    pending: 'Deleting component...',
                    success: 'Deleted Successfully!',
                    error: 'Failed to delete component. Please try again.',
                }
            );
            close();
            window.location.reload()
            
        } catch (error) {
            console.error('Error deleting component:', error);
        }
    };


    return (

        <div
            onClick={handleClose}
            id='container'
            className="fixed inset-0 z-30 bg-black/25 flex justify-center items-center">

            <div className="   hideScrollbar bg-[#EBE2F5] w-[80%] md:w-[50%] xl:w-[40%] mt-14  h-[35%] pb-8 rounded-xl overflow-y-scroll hideScrollbar">
                {/* header */}
                <div className="flex leading-none items-center sticky top-0 bg-[#60B0F4] left-0 box-border justify-between w-full overflow-hidden z-50 border-b-2 py-3">
                    <div className="flex justify-start mx-6 py-3 w-full items-baseline">
                        <FaArrowRight
                            className="text-white cursor-pointer"
                            onClick={close}
                        />
                    </div>
                </div>
                <h2 className="md:text-[25px] px-2 md:px-8 text-md  my-8 text-center text-[#7B7B7B] font-bold mb-4">Are you sure you want to delete this component?</h2>
                <div className='flex justify-between px-8 md:px-16 pt-12  '>
                    <button
                        onClick={close}
                        className="border hover:bg-[#60B0F4] hover:text-white border-blue-600 px-4 py-2 rounded-lg ">No</button>
                    <button
                        onClick={handleDelete}

                        className="bg-[#60B0F4]  text-white border px-4 py-2 rounded-lg ">Yes</button>
                </div>
            </div>
        </div>


    );
};

export default DeleteModal;


