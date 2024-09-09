"use client";

import api from "@/utils/api";
import ReusableForm from "../ReusableForm";
import { useToast } from "@/hooks/use-toast";

const CreateUser = () => {
  const { toast } = useToast();
  const fields = [
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
      name: "employee_id",
      label: "Employee ID",
      type: "text",
      placeholder: "Enter Employee ID",
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

  const handleSubmit = async (formData: {
    [key: string]: string | boolean;
  }) => {
    console.log("Form submitted:", formData.email);
    try {
      await api.post("/users/", {
        ...formData,
      });
      let currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `User ${formData.email} successfully created!`,
        description: `Created ${currentDate}`,
      });
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
