"use client";

import api from "@/utils/api";
import ReusableForm from "../ReusableForm";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CreateItem = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [unitKit, setUnitKit] = useState<any[]>([]);
  const [itemStatus, setItemStatus] = useState<any[]>([]);
  const { toast } = useToast();

  const { user } = useAuth();

  console.log("current user", user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        console.error(err);
      }
    };

    const fetchUnitKit = async () => {
      try {
        const res = await api.get("/kits");
        setUnitKit(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        console.error(err);
      }
    };

    const fetchItemStatus = async () => {
      try {
        const res = await api.get("/unit-status");
        setItemStatus(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        console.error(err);
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
  ];

  const handleSubmit = async (formData: {
    [key: string]: string | boolean;
  }) => {
    try {
      await api.post("/items/", {
        ...formData,
        category: formData.category
          ? parseInt(formData.category as string)
          : null,
      });
      let currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `Item ${formData.name} successfully created`,
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
      buttonText="Add item"
    />
  );
};

export default CreateItem;
