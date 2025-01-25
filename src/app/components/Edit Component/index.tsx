
"use client";
import React, { useState, useEffect } from "react";
import { FaArrowRight, FaChevronUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FaCamera } from "react-icons/fa6";
import addCompServices from "@/app/appwrite/componentService";
import Image from "next/image";
import { toast, Zoom } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";


interface EditCompprops {
    isVisible: boolean;
    close: () => void;
    existingData: any;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name should be at least 3 characters long")
        .required("Name is required"),
    category: Yup.string()
        .oneOf(["SMD", "Through hole"], "Invalid category")
        .required("Category is required"),
    location: Yup.string(),
    quantity: Yup.string().required("Quantity is required"),
});

const EditComponents: React.FC<EditCompprops> = ({ isVisible, close, existingData }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(existingData.imageUrl || "");

    useEffect(() => {
        if (selectedImage) {
            const previewUrl = URL.createObjectURL(selectedImage);
            setPreview(previewUrl);
            // Cleanup
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [selectedImage]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: existingData?.name || "",
            category: existingData?.category || "",
            location: existingData?.location || "",
            quantity: existingData?.quantity || "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleClose = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === "container") close();
    };

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);


const onSubmit = async (values: any) => {
    let toastId: any | null; // Declare toastId type
    try {
        // Prepare the updated data
        const updatedData = {
            name: values.name,
            category: values.category,
            location: values.location,
            quantity: values.quantity,
            image: selectedImage, // Include the new image file if it exists
        };

        // Handle the image field
        if (selectedImage) {
            updatedData.image = selectedImage; // New image selected
        } else {
            updatedData.image = existingData.image; // Retain existing image
        }

        // Debugging

        // Show loading toast while updating
        const toastId = toast.loading("Updating component...", {
            position: "top-right",
            style: {

                color: "black  "
            },
            hideProgressBar: false,
            transition: Zoom,
        });

        // Call the service to update the component
        await addCompServices.updateComp(existingData.$id, updatedData);

        // Close the modal
        close();

        // Close the loading toast
        toast.dismiss(toastId);

        // Show success toast after updating
        toast.success("Component updated successfully!", {
            position: "top-right",
            autoClose: 1000,
            transition: Zoom,
            hideProgressBar: false,
        });

        window.location.reload();

    } catch (error) {
        console.error("Error updating component:", error);

        // Close the loading toast
        if (toastId) toast.dismiss(toastId);

        // Show error toast
        toast.error("Failed to update component. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            transition: Zoom,
            hideProgressBar: false,
        });
    }
};


if (!isVisible) return null;

return (
    <div
        onClick={handleClose}
        id="container"
        className="fixed inset-0 z-30 bg-black/25 flex justify-center items-center"
    >


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  bgColor  w-[80%] sm:w-[60%] md:w-[40%] mt-32 lg:w-[30%] h-[80%] pb-8 rounded-xl overflow-y-scroll hideScrollbar  ">
            <div className="flex leading-none items-center sticky top-0 bg-[#60B0F4] left-0 box-border justify-between w-full overflow-hidden z-50 border-b-2 py-1">
                <div className="flex justify-start mx-6 py-3 w-full items-baseline">
                    <FaArrowRight
                        className="text-white cursor-pointer"
                        onClick={close}
                    />
                </div>
            </div>
            <h2 className="text-3xl px-8  my-2 text-center text-[#7B7B7B] font-extrabold mb-4">Edit Component</h2>
            <div className="px-8 flex flex-col space-y-6">
                <div>
                    <label htmlFor="name" className="block text-md md:text-xl font-semibold mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register("name")}
                        className="w-full border rounded p-2"
                    />
                    {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
                </div>

                <div className="relative">
                    <label htmlFor="category" className="block text-md md:text-xl font-semibold mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        {...register("category")}
                        className="w-full bg-white border rounded appearance-none p-2"
                    >
                        <option value="" label="Select a category" />
                        <option value="SMD" label="SMD" />
                        <option value="Through hole" label="Through hole" />
                    </select>
                    <span className="absolute right-4 top-[53px] transform -translate-y-1/2 text-black pointer-events-none">
                        <FaChevronUp />
                    </span>
                    {errors.category && (
                        <span className="text-red-600 text-sm">{errors.category.message}</span>
                    )}
                </div>

                <div>
                    <label htmlFor="location" className="text-md md:text-xl block font-semibold mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        {...register("location")}
                        className="w-full border rounded p-2"
                    />
                    {errors.location && <span className="text-red-600 text-sm">{errors.location.message}</span>}
                </div>

                <div className="relative">
                    <label htmlFor="quantity" className="text-md md:text-xl block font-semibold mb-1">
                        Quantity
                    </label>
                    <select
                        id="quantity"
                        {...register("quantity")}
                        className="w-full border bg-white rounded p-2 appearance-none"
                    >
                        <option value="" label="Select quantity" />
                        <option value="0-10" label="0-10" />
                        <option value="10-30" label="10-40" />
                        <option value="40-80" label="40-80" />
                        <option value="80-100" label="80-100" />
                        <option value="100-140" label="100-140" />
                        <option value="140-200" label="140-200" />
                        <option value="200+" label="200+" />
                    </select>
                    <span className="absolute right-4 top-[53px] transform -translate-y-1/2 text-black pointer-events-none">
                        <FaChevronUp />
                    </span>
                    {errors.quantity && (
                        <span className="text-red-600 text-sm">{errors.quantity.message}</span>
                    )}
                </div>

                <div className="relative w-full h-60 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
                    {selectedImage ? (
                        <Image
                            src={preview}
                            alt="New Image Preview"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                        />
                    ) : existingData.imageUrl ? (
                        <Image
                            src={existingData.imageUrl}
                            alt={existingData.name || 'Existing Image'}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                            <FaCamera className="text-gray-500 text-3xl" />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setSelectedImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                <div className="flex justify-between xl:px-24">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="border border-blue-600 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </form>
    </div>
);
};

export default EditComponents;

