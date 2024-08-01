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
  const [profile, setProfile] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get(`/users/${userId}`);
        const userData = userRes.data;
        setUser(userData);
        if (userData.profile) {
          fetchProfile(userData.profile.id);
        }
      } catch (err: any) {
        setError(err);
      }
    };

    const fetchProfile = async (profileId: number) => {
      try {
        const userProfileRes = await api.get(`/profile/${profileId}`);
        setProfile(userProfileRes.data);
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
  if (!user || !profile) return <p>Loading...</p>;

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
  ];

  const profileFields = [
    {
      name: "employee_id",
      label: "Employee ID",
      type: "text",
      placeholder: "",
      value: profile.employee_id,
    },
    {
      name: "contact",
      label: "Contact",
      type: "text",
      placeholder: "",
      value: profile.contact,
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
      value: profile?.department?.toString() || "",
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string }) => {
    try {
      await api.put(`/users/${userId}/`, {
        username: user.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });
      setAlert("Updated successfully");
      setTimeout(() => setAlert(null), 3000);
      router.refresh();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleProfileSubmit = async (formData: { [key: string]: string }) => {
    try {
      await api.put(`/profile/${profile.id}/`, {
        user: user.id,
        employee_id: formData.employee_id,
        contact: formData.contact,
        department: formData.department,
      });
      setAlert("Updated successfully");
      setTimeout(() => setAlert(null), 3000);
      router.refresh();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal information</TabsTrigger>
          <TabsTrigger value="company">Additional information</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Personal information of the user.
              </CardDescription>
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
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Employee information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReusableForm
                fields={profileFields}
                onSubmit={handleProfileSubmit}
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
