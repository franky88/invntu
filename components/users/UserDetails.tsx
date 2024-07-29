"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}/`);
        const data = res.data;
        setUser(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <form>
      <Card x-chunk="dashboard-07-chunk-0">
        <CardHeader>
          <CardTitle>Personal informations</CardTitle>
          <CardDescription>Personal informations of the user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">First name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                defaultValue={user.first_name}
                value={user.first_name}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Last name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                defaultValue={user.last_name}
                value={user.last_name}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Email</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                defaultValue={user.email}
                value={user.email}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-07-chunk-0">
        <CardHeader>
          <CardTitle>Additional information</CardTitle>
          <CardDescription>User addtional informations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Employee ID</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                defaultValue={user.first_name}
                value={user.profile ? user.profile.employee_id : ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Contact number</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                defaultValue={user.profile ? user.profile.contact : ""}
                value={user.profile ? user.profile.contact : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UserDetails;
