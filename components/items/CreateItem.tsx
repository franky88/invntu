"use client";

import api from "@/utils/api";
import ReusableForm from "../ReusableForm";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const CreateItem = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [unitKit, setUnitKit] = useState<any[]>([]);
  const [itemStatus, setItemStatus] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);

  const { user } = useAuth();

  console.log("current user", user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        setError(err);
      }
    };

    const fetchUnitKit = async () => {
      try {
        const res = await api.get("/kits");
        setUnitKit(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        setError(err);
      }
    };

    const fetchItemStatus = async () => {
      try {
        const res = await api.get("/unit-status");
        setItemStatus(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchCategories();
    fetchUnitKit();
    fetchItemStatus();
  }, []);

  const fields = [
    {
      name: "barcode",
      label: "Barcode",
      type: "text",
      placeholder: "Enter barcode",
      value: "",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      value: "",
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      placeholder: "",
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
    {
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "Select a category",
      options: categories.map((cat: any) => ({
        value: cat.id.toString(),
        label: cat.name,
      })),
      value: "",
    },
    {
      name: "unit_kit",
      label: "Unit kit",
      type: "select",
      placeholder: "Select a kit",
      options: unitKit.map((uk: any) => ({
        value: uk.id.toString(),
        label: uk.name,
      })),
      value: "",
    },
    {
      name: "item_status",
      label: "Item Status",
      type: "select",
      placeholder: "Select a item status",
      options: itemStatus.map((status: any) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      value: "",
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string }) => {
    try {
      const res = await api.post("/units/", {
        ...formData,
        category: formData.category ? parseInt(formData.category) : null,
        unit_kit: formData.unit_kit ? parseInt(formData.unit_kit) : null,
        item_status: formData.item_status
          ? parseInt(formData.item_status)
          : null,
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
