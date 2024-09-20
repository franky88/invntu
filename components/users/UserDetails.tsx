"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api, { GetDepartments, PutUser } from "@/utils/api";
import { GetUser } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import KitCard from "../kits/KitCard";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import FetchDepartment from "../departments/FetchDepartment";

const UserDetails = () => {
  const { userId } = useParams();
  const id = Number(userId);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const methods = useForm<User>({});

  const { control, handleSubmit, setValue } = methods;

  const fetchUser = async () => {
    try {
      const userRes = await GetUser(id);
      if (userRes) {
        setUser(userRes);
        Object.keys(userRes).forEach((key) =>
          setValue(key as keyof User, userRes[key as keyof User])
        );
      } else {
        console.error("User data is undefined.");
      }
    } catch (err: any) {
      setError(err);
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, setValue]);

  if (error) return <p>Error loading user data</p>;
  if (!user) return <p>Loading...</p>;

  const onSubmit = async (formData: User) => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key as keyof User]);
      });

      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (user.image !== null) {
        data.append("image", user.image);
      } else {
        if (fileInput?.files?.[0]) {
          console.log("image file", fileInput?.files?.[0]);
          data.append("image", fileInput.files[0]);
        }
      }

      await PutUser(id, data);

      const currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `User ${formData.email} updated successfully!`,
        description: `Updated ${currentDate}`,
      });

      await fetchUser();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error updating user",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const discardUpdate = () => {
    router.push("/users");
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      try {
        await api.put(`/users/${id}/upload_edit_image/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await fetchUser();
        console.log("Image uploaded successfully!");

        const currentDate = new Date().toJSON().slice(0, 10);
        toast({
          title: `User image updated successfully!`,
          description: `Updated ${currentDate}`,
        });
      } catch (error: any) {
        console.error("Image upload failed:", error);
        toast({
          title: "Error uploading image",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.click();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Update User
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {user.is_working ? (
                <div className="text-green-600">Working</div>
              ) : (
                <div className="text-red-600">Resigned</div>
              )}
            </Badge>
            <div className="items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={discardUpdate}
              >
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
                  <CardTitle>Update user</CardTitle>
                  <CardDescription>User information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row gap-3 items-center justify-center">
                    <div className="w-1/2">
                      {user.image ? (
                        <div className="relative">
                          <Image
                            src={user.image}
                            alt="profile image"
                            className="h-[273px] w-[273px] object-cover rounded-md"
                            width={273}
                            height={273}
                            priority={true}
                          />
                          <Input
                            type="file"
                            id="file-input"
                            name="image"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={triggerFileInput}
                            className="h-7 absolute inset-20 mx-auto my-40 flex items-center justify-center"
                          >
                            Change image
                          </Button>
                        </div>
                      ) : (
                        <div className="h-[273px] w-[273px] flex flex-col gap-3 items-center justify-center border-2 border-dotted rounded-md">
                          <ImagePlus className="mx-auto" />
                          <Input
                            type="file"
                            id="file-input"
                            name="image"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={triggerFileInput}
                            className="h-7"
                          >
                            Upload image
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="w-1/2">
                      <FormField
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter first name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter last name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="birth_date"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                placeholder="Enter birth date"
                                value={
                                  field.value
                                    ? (field.value as unknown as string)
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="contact"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter contact number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Employment information</CardTitle>
                  <CardDescription>User employment information</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Form Fields */}
                  <FormField
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder="Enter email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="employee_id"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter employee" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="is_working"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center mt-2 mb-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel className="ml-2">Is working?</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <FetchDepartment
                            userValue={
                              field.value ? field.value.toString() : ""
                            }
                            onChangeValue={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Add other form fields in a similar manner */}
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Kit Assignments</CardTitle>
                  <CardDescription>Kit assignment informations</CardDescription>
                </CardHeader>
                <CardContent>
                  <KitCard userID={id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserDetails;
