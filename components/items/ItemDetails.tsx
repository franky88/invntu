"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api, { GetCategories, GetUnitStatuses } from "@/utils/api";
import { GetItem, GetKits } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ItemDetails = () => {
  const { itemId } = useParams();
  const id = Number(itemId);
  const router = useRouter();
  const [item, setItem] = useState<Item>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [unitKits, setUnitKits] = useState<Kit[]>([]);
  const [itemStatus, setItemStatus] = useState<ItemStatus[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);
  const { toast } = useToast();

  const methods = useForm<Item>();

  const { control, handleSubmit, setValue } = methods;

  const fetchItem = async () => {
    console.log("item ID: ", id);

    try {
      const response = await GetItem(id);
      if (response) {
        setItem(response);
        Object.keys(response).forEach((key) =>
          setValue(key as keyof Item, response[key as keyof Item])
        );
      } else {
        console.error("User data is undefined.");
      }
    } catch (err: any) {
      setError(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await GetCategories();
      setCategories(response || []);
    } catch (err: any) {
      setError(err);
    }
  };

  const fetchUnitKits = async () => {
    try {
      const response = await GetKits();
      setUnitKits(response || []);
    } catch (err: any) {
      setError(err);
    }
  };

  const fetchItemStatus = async () => {
    try {
      const response = await GetUnitStatuses();
      setItemStatus(response || []);
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchItem();
    fetchCategories();
    fetchUnitKits();
    fetchItemStatus();
  }, [id]);

  if (error) return <p>Error loading item data</p>;
  if (!item) return <p>Loading...</p>;

  const onSubmit = async (formData: Item) => {
    try {
      await api.put(`/items/${id}/`, {
        ...formData,
        category: formData.category ? formData.category : null,
        unit_kit: formData.unit_kit ? formData.unit_kit : null,
        item_status: formData.item_status ? formData.item_status : null,
      });

      let currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `Item ${formData.name} updated successfully`,
        description: `Updated ${currentDate}`,
      });

      await fetchItem();

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

  const discardUpdate = () => {
    router.push("/items");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/items">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Update Item
            </h1>
            <div className="items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm" onClick={discardUpdate}>
                Discard
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Update item</CardTitle>
                  <CardDescription>Update item informations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter barcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="descriptions"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriptions</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter descriptions" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    name="date_purchased"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Purchased</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            placeholder="Enter date purchased"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Item category</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ? field.value.toString() : ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Department</SelectLabel>
                                {categories.map((cat) => (
                                  <SelectItem
                                    key={cat.id}
                                    value={cat.id.toString()}
                                  >
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ItemDetails;
