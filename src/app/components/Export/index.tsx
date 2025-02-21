
"use client";
import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import addCompServices from "@/app/appwrite/componentService";
import Link from "next/link";
import { toast } from "react-toastify";

const ExportComponents: React.FC = () => {
    const [components, setComponents] = useState<any[]>([]);

    const initialValues = {
        name: "",
        category: "All",
        location: "",
        quantity: "",
        image: null,
    };

    const validationSchema = Yup.object({
        category: Yup.string()
            .oneOf(["SMD", "Through hole", "Others", "All"], "Invalid category"),
    });

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const allComponents = await addCompServices.getAllComp();
                setComponents(allComponents);
            } catch (error) {
                console.error("Error fetching components:", error);
            }
        };

        fetchComponents();
    }, []);

    const generatePDF = (category: string, components: any[]): boolean => {
        if (!components || components.length === 0) {
            toast.warn("No components available to export.");
            return false;
        }

        const filteredComponents =
            category === "All"
                ? components
                : components.filter((component: any) => component.category === category);

        if (filteredComponents.length === 0) {
            toast.warn("No matching components for the selected category.");
            return false;
        }

        const doc = new jsPDF();
        doc.setFont("Times New Roman", "bold");
        doc.setFontSize(18);
        doc.text("I Tech Inventory", 105, 20, { align: "center" });

        const tableData = filteredComponents.map((component: any, index: any) => [
            index + 1,
            component.name,
            component.category,
            component.location,
            component.quantity,
        ]);

        const tableColumns = ["Sr. No", "Name", "Category", "Location", "Quantity"];

        doc.autoTable({
            head: [tableColumns],
            body: tableData,
            startY: 30,
        });

        doc.save("exported_inventory.pdf");
        return true;
    };

    const generateExcel = (category: string, components: any[]): boolean => {
        if (!components || components.length === 0) {
            toast.warn("No components available to export.");
            return false;
        }

        const filteredComponents =
            category === "All"
                ? components
                : components.filter((component: any) => component.category === category);

        if (filteredComponents.length === 0) {
            toast.warn("No matching components for the selected category.");
            return false;
        }

        // Prepare data for Excel
        const worksheetData = [
            ["Sr. No", "Name", "Category", "Location", "Quantity"], // Header row
            ...filteredComponents.map((component: any, index: number) => [
                index + 1,
                component.name,
                component.category,
                component.location,
                component.quantity,
            ]),
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Convert data to a worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory"); // Add the worksheet to the workbook

        // Export to Excel
        XLSX.writeFile(workbook, "exported_inventory.xlsx");
        return true; // Removed toast.success here
    };

    const handleExcelExport = (values: any) => {
        const { category } = values;
        const isSuccessful = generateExcel(category, components);
        if (isSuccessful) {
            toast.success("Excel file exported successfully!"); // Trigger success toast here
        }
    };


    const hanldeForm = () => {
        console.log("form submit")
    };

    const handlePDFExport = (values: any) => {
        const { category } = values;
        const isSuccessful = generatePDF(category, components);
        if (isSuccessful) {
            toast.success("PDF exported successfully!");
        }
    };

   ;


    return (
        <div className="flex h-screen flex-col justify-center items-center rounded-xl">
            <div className="bgColor w-[80%] sm:w-[70%] md:w-[58%] lg:w-[45%] xl:w-[40%] rounded-xl py-8 sm:px-8 border-2 hover:border-black shadow-xl">
                <h2 className="text-xl px-2 sm:text-3xl text-center text-[#7B7B7B] font-extrabold my-12">
                    Export Inventory
                </h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={hanldeForm}
                >
                    {({ values }) => (
                        <Form className="space-y-12 px-8 mb-12">
                            <div className="relative">
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
                                <span className="absolute right-4 top-[47px] transform -translate-y-1/2 text-black pointer-events-none">
                                    <FaChevronUp />
                                </span>
                                <ErrorMessage
                                    name="category"
                                    component="div"
                                    className="text-red-600 text-sm"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handlePDFExport(values)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Export to PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleExcelExport(values)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Export to Excel
                                </button>
                                <Link href="/">
                                    <button className="border w-full border-blue-600 px-4 py-2 rounded">
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

