

"use client"
import React, { useEffect } from 'react';
import { FaArrowRight, FaCamera } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import addCompServices from '@/app/appwrite/componentService';
import Image from 'next/image';
import { FaChevronUp } from "react-icons/fa";
import { toast, Zoom } from 'react-toastify';



interface AddCompprops {
    isVisible: boolean;
    close: () => void;
}

const AddComponents: React.FC<AddCompprops> = ({ isVisible, close }) => {

    //    Initial values for the form
    const initialValues = {
        name: "",
        category: "",
        location: "",
        quantity: "",
        image: null,
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Name should be at least 3 characters long'),
        category: Yup.string()
            .required('Category is required')
            .oneOf(['SMD', 'Through hole'], 'Invalid category'),
        location: Yup.string().required('Location is required'),
        image: Yup.mixed()
            .test('fileFormat', 'Only PNG or JPG files are allowed', (value) => {
                return value && (value.type === 'image/png' || value.type === 'image/jpeg');
            }),
    });

    const addComp = async (data: any) => {

        try {
            let uploadedFile;
            // Check if an image file is provided
            if (data.image) {
                // Upload the file and get the response (metadata)
                uploadedFile = await addCompServices.uploadFile(data.image);
                console.info('Uploaded File:', uploadedFile.$id); // Log the file metadata


            }
            // Show loading toast while updating
            const toastId = toast.loading("Adding component...", {
                position: "top-right",
                style: {

                    color: "black  "
                },
                hideProgressBar: false,
                transition: Zoom,
            });
            // Now call createComponents with the file ID or null if no file was uploaded
            const component = await addCompServices.createComponents({
                name: data.name,
                category: data.category,
                location: data.location,
                quantity: data.quantity,
                imageFile: uploadedFile ? uploadedFile.$id : null, // Pass the file ID or null if no file
            });
            // Close the modal
            close();

            // Close the loading toast
            toast.dismiss(toastId);
            toast.success("Component Added successfully!", {
                position: "top-right",
                autoClose: 1000,
                transition: Zoom,
                hideProgressBar: false,
            });

            window.location.reload();


        } catch (error: any) {
            console.error('Error creating component:', error.message || error);
            // Close the loading toast
            toast.dismiss(toastId);

            // Show error toast
            toast.error("Failed to Add new component. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                transition: Zoom,
                hideProgressBar: false,
            });
        }
    };





    // handle on rest space click
    const handleClose = (e: any) => {
        if (e.target.id === "container") close();
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

    return (

        <div
            onClick={handleClose}
            id='container'
            className="fixed inset-0 z-30 bg-black/25 flex justify-center items-center">

            <div className="   hideScrollbar bg-gray-200  w-[80%] sm:w-[60%] md:w-[40%] mt-32 lg:w-[30%] h-[80%] pb-8 rounded-xl overflow-y-scroll hideScrollbar">
                {/* header */}
                <div className="flex leading-none items-center sticky top-0 bg-[#60B0F4] left-0 box-border justify-between w-full overflow-hidden z-50 border-b-2 py-1">
                    <div className="flex justify-start mx-6 py-3 w-full items-baseline">
                        <FaArrowRight
                            className="text-white cursor-pointer"
                            onClick={close}
                        />
                    </div>
                </div>
                <h2 className="text-3xl px-8  my-2 text-center text-[#7B7B7B] font-extrabold mb-4">New Component</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values: any, { resetForm }) => {
                        addComp(values)
                        resetForm()
                        // Added code to reset the image preview upon form submission
                        const preview = document.getElementById('image-preview');
                        if (preview) {
                            preview.src = "";
                            preview.style.display = 'none';
                        }

                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="space-y-6 px-2  sm:px-8 ">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block font-semibold mb-1">
                                    Name
                                </label>

                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full  border  focus:outline-none bg-white  py-3  shadow-md  rounded-xl px-2"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                            </div>

                            {/* Category Field */}
                            <div className='px-2 relative'>
                                <label htmlFor="category" className="block font-semibold mb-1">
                                    Category
                                </label>
                                <Field
                                    as="select"
                                    name="category"
                                    id="category"
                                    className="w-full border focus:outline-none bg-white shadow-md rounded-xl py-3 px-2 pr-10 appearance-none"
                                >
                                    <option value="" label="Select a category" />
                                    <option value="SMD" label="SMD" />
                                    <option value="Through hole" label="Through hole" />
                                </Field>
                                <span className="absolute right-6 top-[53px] transform -translate-y-1/2 text-black  pointer-events-none">
                                    <FaChevronUp />
                                </span>
                                <ErrorMessage name="category" component="div" className="text-red-600 text-sm" />
                            </div>


                            {/* Location Field */}
                            <div>
                                <label htmlFor="location" className="block font-semibold mb-1">
                                    Location
                                </label>
                                <Field
                                    type="text"
                                    name="location"
                                    id="location"
                                    className="w-full border  focus:outline-none bg-white  shadow-md  rounded-xl  py-3 px-2"
                                />
                                <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />
                            </div>
                            {/* Quantity Field */}
                            <div className='relative '>
                                <label htmlFor="quantity" className="text-md md:text-xl block font-semibold mb-1">
                                    Quantity
                                </label>
                                <Field
                                    as="select"
                                    name="quantity"
                                    id="quantity"
                                    className="w-full border appearance-none  focus:outline-none bg-white  shadow-md  rounded-xl  py-3 px-2"
                                >
                                    <option value="" label="Select quantity" />
                                    <option value="0-10" label="0-10" />
                                    <option value="10-30" label="10-40" />
                                    <option value="0-10" label="40-80" />
                                    <option value="10-30" label="80-100" />
                                    <option value="0-10" label="100-140" />
                                    <option value="10-30" label="140-200" />
                                    <option value="10-30" label="200+" />
                                </Field>
                                <span className="absolute right-5 top-[57px] transform -translate-y-1/2 text-black  pointer-events-none">
                                    <FaChevronUp />
                                </span>
                                <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
                            </div>


                            {/* Image Field */}
                            <div className="flex flex-col  space-y-2">
                                <label htmlFor="image" className="text-md md:text-xl block font-semibold mb-1">
                                    Image
                                </label>
                                <div className="relative w-full h-60 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
                                    {/* Placeholder for the image */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                                        <FaCamera className="text-gray-500 text-3xl" />
                                    </div>
                                    {/* Image Preview */}
                                    <Image
                                        id="image-preview"
                                        className="absolute bg-white inset-0 w-full h-full object-cover"
                                        style={{ display: 'none' }}
                                        alt="Preview"
                                    />
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        capture="environment"
                                        className="absolute bg-white  inset-0 opacity-0 cursor-pointer"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const preview = document.getElementById('image-preview');
                                                    if (preview) {
                                                        preview.src = reader.result as string;
                                                        preview.style.display = 'block';
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                                setFieldValue('image', file); // Set the image in Formik's state
                                            }
                                        }}
                                    />
                                </div>
                                <ErrorMessage name="image" component="div" className="text-red-600 text-sm" />
                            </div>


                            {/* Buttons */}
                            <div className="flex justify-between xl:px-24">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Add
                                </button>
                                <button
                                    type="reset"
                                    className=" border border-blue-600   px-4 py-2 rounded "
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>


    );
};

export default AddComponents;


