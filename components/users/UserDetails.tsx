"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const UserDetails = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [userProfile, setUserProfile] = useState({
    employee_id: "",
    contact: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get(`/users/${userId}/`);
        const user = res.data;
        const proRes = await api.get(`/profile/${user.profile.id}`);
        const profile = proRes.data;
        console.log("user profile", profile);
        setUserData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
        });
        setUserProfile({
          employee_id: profile.employee_id || "",
          contact: profile.contact || "",
        });
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUserData();
  }, [userId]); // Ensure the effect only runs when userId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in userData) {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name in userProfile) {
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update user data
      const response = await api.put(`/users/${userId}/`, userData);
      if (response) {
        // Update user profile data
        const res2 = await api.put(
          `/profile/${response.data.profile.id}/`,
          userProfile
        );
        console.log("User and profile updated:", response.data, res2.data);

        // Redirect to the user list and refresh the page
        router.push("/users");
      } else {
        console.error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-shrink-0 gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Personal information of the user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                className="w-full"
                value={userData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                className="w-full"
                value={userData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="w-full"
                value={userData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Additional information about the user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                name="employee_id"
                type="text"
                className="w-full"
                value={userProfile.employee_id}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="contact">Contact number</Label>
              <Input
                id="contact"
                name="contact"
                type="text"
                className="w-full"
                value={userProfile.contact}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Button type="submit" variant="default">
        Save user
      </Button> */}
    </form>
  );
};

export default UserDetails;
