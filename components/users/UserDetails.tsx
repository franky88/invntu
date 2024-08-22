"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, Divide } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const UserDetails = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get(`/users/${userId}`);
        const userData = userRes.data;
        setUser(userData);
      } catch (err: any) {
        setError(err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.results);
        console.log(res.data.results);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchUser();
    fetchDepartments();
  }, [userId]);

  if (error) return <p>Error loading user data</p>;
  if (!user) return <p>Loading...</p>;

  const userFields = [
    {
      name: "first_name",
      label: "First name",
      type: "text",
      placeholder: "",
      value: user.first_name,
    },
    {
      name: "last_name",
      label: "Last name",
      type: "text",
      placeholder: "",
      value: user.last_name,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "",
      value: user.email,
    },
    {
      name: "employee_id",
      label: "Employee ID",
      type: "text",
      placeholder: "",
      value: user.employee_id,
    },
    {
      name: "position",
      label: "Position",
      type: "text",
      placeholder: "",
      value: user.position,
    },
    {
      name: "birth_date",
      label: "Birth Date",
      type: "date",
      placeholder: "",
      value: user.birth_date,
    },
    {
      name: "contact",
      label: "Contact",
      type: "text",
      placeholder: "",
      value: user.contact,
    },
    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
      placeholder: "",
      value: user.is_active,
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      placeholder: "Select a department",
      options: departments.map((dept: any) => ({
        value: dept.id.toString(),
        label: dept.name,
      })),
      value: user?.department?.toString() || "",
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string }) => {
    try {
      await api.put(`/users/${userId}/`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        employee_id: formData.employee_id,
        position: formData.position,
        birth_date: formData.birth_date,
        contact: formData.contact,
        is_active: formData.is_active,
        department: formData.department ? parseInt(formData.department) : null,
      });
      setAlert("Updated successfully");

      const res = await api.get(`/users/${userId}`);
      setUser(res.data);

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
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
          {user.is_active ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Inactive</div>
          )}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Update user</CardTitle>
              <CardDescription>User information</CardDescription>
            </CardHeader>
            <CardContent>
              <ReusableForm
                fields={userFields}
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
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
