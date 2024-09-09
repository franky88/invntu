"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api, { GetDepartments } from "@/utils/api";
import { GetUser } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const UserDetails = () => {
  const { userId } = useParams();
  const id = Number(userId);
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);
  const { toast } = useToast();

  const methods = useForm<User>({});

  const { control, handleSubmit, setValue } = methods;

  const fetchUser = async () => {
    try {
      const userRes = await GetUser(id);
      console.log(userRes);
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

  const fetchDepartments = async () => {
    try {
      const response = await GetDepartments();
      setDepartments(response || []);
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDepartments();
  }, [id, setValue]);

  if (error) return <p>Error loading user data</p>;
  if (!user) return <p>Loading...</p>;

  const onSubmit = async (formData: User) => {
    try {
      await api.put(`/users/${userId}/`, {
        ...formData,
        department: formData.department
          ? parseInt(formData.department.toString())
          : null,
      });

      let currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `User ${formData.email} updated successfully!`,
        description: `Updated ${currentDate}`,
      });

      await fetchUser();
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
    router.push("/users");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <CardTitle>Update user</CardTitle>
                  <CardDescription>User information</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Form Fields */}
                  <FormField
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter first name" />
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
                  {/* Add other form fields in a similar manner */}
                </CardContent>
              </Card>
              {alert && (
                <Alert className="bg-green-200">
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ? field.value.toString() : ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Department</SelectLabel>
                                {departments.map((department) => (
                                  <SelectItem
                                    key={department.id}
                                    value={department.id.toString()}
                                  >
                                    {department.name}
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

                  {/* Add other form fields in a similar manner */}
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
