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
        const res = await api.get("/department");
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
        birth_date: formData.birth_date, // Ensure this is in 'YYYY-MM-DD' format
        contact: formData.contact,
        department: formData.department ? parseInt(formData.department) : null,
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
          <TabsTrigger value="personal">User Details</TabsTrigger>
          <TabsTrigger value="company">Update User</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>
                Personal information of the user.
              </CardDescription>
            </CardHeader>
            <CardContent>{user.full_name}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Update user</CardTitle>
              <CardDescription>User information.</CardDescription>
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
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserDetails;
