"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReusableForm from "../ReusableForm";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const userInput = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Email",
      value: "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      value: "",
    },
  ];

  const handleSubmit = async (formData: {
    [key: string]: string | boolean;
  }) => {
    try {
      const email = formData.email as string;
      const password = formData.password as string;
      await login(email, password);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 m-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <ReusableForm
              fields={userInput}
              onSubmit={handleSubmit}
              buttonText="Login"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
