"use client";

import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import authService from "@/app/appwrite/auth";
import {login as loginAction} from "../../redux/slices/authSlice"
import { useDispatch } from "react-redux";
interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  const login = async (data:LoginFormValues) => {
    setError("");
    try {
      const session:any = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        dispatch(loginAction(userData))
        router.push("/");
      }
    } catch (error:any) {
      setError(error.message);
    }
  };


  return (
    <>
      <div className="pt-40">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            login(values);
            resetForm();
          }}
        >
          {({ isValid, dirty }) => (
            <div className="max-w-sm sm:max-w-md lg:max-w-lg shadow-xl border-2 mx-auto flex flex-col text-center py-10 px-4 sm:px-6 bg-white border-[#68a1ec] rounded-2xl">
              <h1 className="font-bold text-[1.8rem] sm:text-[2rem] leading-[1.875rem] sm:leading-[2.4375rem] text-[#68a1ec]">
                Login
              </h1>
              {error && <p className="text-red-600">{error}</p>}
              <Form className="flex flex-col gap-4 p-4 sm:p-6 rounded-lg mt-4">
                {/* Email Field */}
                <div className="flex w-full flex-col mb-4">
                  <label
                    htmlFor="email"
                    className="text-[1rem] sm:text-[1.25rem] leading-[1.25rem] sm:leading-[1.5rem] text-left mb-2 font-bold"
                  >
                    Email
                  </label>
                  <Field name="email">
                    {({ field }: { field: React.InputHTMLAttributes<HTMLInputElement> }) => (
                      <input
                        {...field}
                        type="email"
                        required
                        className="p-3 w-full border rounded-lg bg-[#E7EEF0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#68a1ec]"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Password Field */}
                <div className="flex w-full flex-col mb-4 relative">
                  <label
                    htmlFor="password"
                    className="text-[1rem] sm:text-[1.25rem] leading-[1.25rem] sm:leading-[1.5rem] text-left mb-2 font-bold"
                  >
                    Password
                  </label>
                  <Field name="password">
                    {({ field }: { field: React.InputHTMLAttributes<HTMLInputElement> }) => (
                      <div className="relative">
                        <input
                          {...field}
                          type="password"
                          required
                          className="p-3 w-full border rounded-lg bg-[#E7EEF0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#9747FF]"
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!(isValid && dirty)}
                  className={`z-[3] mt-6 items-center bg-[#68a1ec] font-semibold text-center px-5 sm:px-10 justify-center overflow-hidden relative text-[#FFFFFF] uppercase py-3 sm:py-4 rounded-full mx-auto ${!(isValid && dirty)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                    }`}
                >
                  Login
                </button>
              </Form>
            </div>
          )}
        </Formik>

      </div >

    </>
  );
};

export default Login;
