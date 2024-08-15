"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReusableForm from "../ReusableForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const ItemDetails = () => {
  const { itemId } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [unitKit, setUnitKit] = useState<any[]>([]);
  const [itemStatus, setItemStatus] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/units/${itemId}`);
        const itemData = res.data;
        setItem(itemData);
      } catch (err: any) {
        setError(err);
      }
    };

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

    fetchItem();
    fetchCategories();
    fetchUnitKit();
    fetchItemStatus();
  }, [itemId]);

  const itemFields = item
    ? [
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "",
          value: item.name,
        },
        {
          name: "model",
          label: "Model",
          type: "text",
          placeholder: "",
          value: item.model,
        },
        {
          name: "serial",
          label: "Serial",
          type: "text",
          placeholder: "",
          value: item.serial,
        },
        {
          name: "date_purchased",
          label: "Date Purchased",
          type: "date",
          placeholder: "",
          value: item.date_purchased,
        },
        {
          name: "cost",
          label: "Cost",
          type: "number",
          placeholder: "",
          value: item.cost,
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
          value: item?.category?.toString() || "",
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
          value: item?.unit_kit?.toString() || "",
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
          value: item?.item_status?.toString() || "",
        },
      ]
    : [];

  if (error) return <p>Error loading item data</p>;
  if (!item) return <p>Loading...</p>;

  const handleSubmit = async (formData: { [key: string]: string }) => {
    try {
      await api.put(`/units/${itemId}/`, {
        name: formData.name,
        model: formData.model,
        cost: formData.cost,
        serial: formData.serial,
        date_purchased: formData.date_purchased,
        category: formData.category ? parseInt(formData.category) : null,
        unit_kit: formData.unit_kit ? parseInt(formData.unit_kit) : null,
        item_status: formData.item_status
          ? parseInt(formData.item_status)
          : null,
      });
      setAlert("Updated successfully");
      setTimeout(() => setAlert(null), 3000);
      router.refresh();
    } catch (error: any) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Item Details</TabsTrigger>
          <TabsTrigger value="company">Update Item</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Item informations</CardDescription>
            </CardHeader>
            <CardContent>{item.name}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Update item</CardTitle>
              <CardDescription>Update item informations.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReusableForm
                fields={itemFields}
                onSubmit={handleSubmit}
                buttonText="Save"
              />
            </CardContent>
            {alert && (
              <CardFooter>
                <Alert className="bg-green-200">
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ItemDetails;
