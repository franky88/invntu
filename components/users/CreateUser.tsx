"use client";

import api from "@/utils/api";
import ReusableForm from "../ReusableForm";

const CreateUser = () => {
  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter username",
      value: "",
    },
    {
      name: "first_name",
      label: "First name",
      type: "text",
      placeholder: "Enter first name",
      value: "",
    },
    {
      name: "last_name",
      label: "Last name",
      type: "text",
      placeholder: "Enter last name",
      value: "",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      value: "",
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string }) => {
    console.log("Form submitted:", formData.username);
    try {
      const res = await api.post("/users/", {
        username: formData.username,
        first_name: formData.firstname,
        last_name: formData.lastname,
        email: formData.email,
      });
      console.log(res.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <ReusableForm
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Create user"
    />
  );
};

export default CreateUser;
