"use client"
import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import jsPDF from "jspdf";
import "jspdf-autotable";
import addCompServices from '@/app/appwrite/componentService';
import Link from 'next/link';
import { toast } from 'react-toastify';




const ExportComponents: React.FC = () => {
    const [components, setComponents] = useState<any[]>([]); // State to hold all fetched components

    // Initial values for the form
    const initialValues = {
        name: '',
        category: 'All',
        location: '',
        quantity: '',
        image: null,
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        category: Yup.string()
            .oneOf(['SMD', 'Through hole', 'Others',  'All'], 'Invalid category'),
    });

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const allComponents = await addCompServices.getAllComp(); // Fetch all components

                setComponents(allComponents); // Set all components
            } catch (error) {
                console.error("Error fetching components:", error);
            }
        };

        fetchComponents();
    }, []);




    // Handle form submission and PDF generation
    const generatePDF = (category: any, components: any): boolean => {
        console.dir("comp before cond ", components);

        if (!components || components.length === 0) {
            toast.warn("No components available to export.");
            return false;
        }

        const filteredComponents = category === "All"
            ? components
            : components.filter((component: any) => component.category === category);

        if (filteredComponents.length === 0) {
            toast.warn("No matching components for the selected category.");
            return false;
        }

        const doc = new jsPDF();

        // Set the title
        doc.setFont("Times New Roman", "bold"); // Make title bold
        doc.setFontSize(18);
        doc.text("I Tech Inventory", 105, 20, { align: "center" });

        // Prepare table data
        const tableData = filteredComponents.map((component: any, index: any) => [
            index + 1,
            component.name,
            component.category,
            component.location,
            component.quantity,
        ]);

        // Define table columns
        const tableColumns = ["Sr. No", "Name", "Category", "Location", "Quantity"];

        // Add the table to the PDF
        
        doc.autoTable({
            head: [tableColumns],
            body: tableData,
            startY: 30, // Adjust start position after the title
        });

        // Save the PDF
        doc.save("exported_inventory.pdf");

        return true;
    };

    const handleSubmit = (values: any) => {
        const isSuccessful = generatePDF(values.category, components);

        if (isSuccessful) {
            toast.success("PDF exported successfully!");
        }
    };


    return (

        <div className="    flex h-screen   flex-col justify-center items-center   rounded-xl ">

            <div className='bgColor  w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[35%] rounded-xl  py-8 sm:px-8 border-2 hover:border-black  shadow-xl '>
                <h2 className="text-xl px-2  sm:text-3xl   text-center text-[#7B7B7B] font-extrabold my-12 ">Export Inventory</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} // Now the handleSubmit receives both form values and components
                >
                    {() => (
                        <Form className="space-y-12 px-8 mb-12  ">
                            {/* Category Field */}
                            <div className='relative '>
                                <label htmlFor="category" className="block font-semibold mb-1">
                                    Select Category
                                </label>
                                <Field
                                    as="select"
                                    name="category"
                                    id="category"
                                    className="w-full focus:outline-none appearance-none bg-white border rounded p-2"
                                >
                                    <option value="All" label="All" />
                                    <option value="SMD" label="SMD" />
                                    <option value="Through hole">Through Hole</option>
                                    <option value="Others">Others</option>
                                </Field>
                                <span className="absolute right-4 top-[47px] transform -translate-y-1/2 text-black  pointer-events-none">
                                    <FaChevronUp />
                                </span>
                                <ErrorMessage name="category" component="div" className="text-red-600 text-sm" />
                            </div>

                            {/* Buttons */}
                            <div className="flex  justify-between md:px-8 lg:px-8   2xl:px-24">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Export
                                </button>
                                <Link href="/">
                                    <button

                                        className="border border-blue-600 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>

            </div>
        </div>

    );
};

export default ExportComponents;
