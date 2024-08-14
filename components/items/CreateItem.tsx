"use client";

import api from "@/utils/api";
import ReusableForm from "../ReusableForm";

const CreateItem = () => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      value: "",
    },
    {
      name: "date_purchased",
      label: "Date Purchased",
      type: "date",
      placeholder: "",
      value: "",
    },
    {
      name: "cost",
      label: "Cost",
      type: "number",
      placeholder: "",
      value: "",
    },
    {
      name: "serial",
      label: "Serial",
      type: "text",
      placeholder: "Enter serial number",
      value: "",
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string }) => {
    console.log("Form submitted:", formData.email);
    try {
      const res = await api.post("/units/", {
        name: formData.name,
        date_purchased: formData.date_purchased,
        cost: formData.cost,
        serial: formData.serial,
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
      buttonText="Add item"
    />
  );
};

export default CreateItem;
