"use client";

import api from "@/utils/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { File, ListFilter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define User type if not already defined

const UsersList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [working, setWorking] = useState<User[] | null>(null);
  const [resigned, setResigned] = useState<User[] | null>(null);
  const [archived, setArchived] = useState<User[] | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/all");
        setUsers(res.data.results);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const getWorkingUsers = async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/working");
        console.log(res.data.results);
        setWorking(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const getResignedUsers = async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/resigned");
        console.log(res.data.results);
        setResigned(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const getArchivedUsers = async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/archived");
        console.log(res.data.results);
        setArchived(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        getUsers(),
        getWorkingUsers(),
        getResignedUsers(),
        getArchivedUsers(),
      ]);
    };

    fetchData();
  }, []);

  const archivedUser = async (user_id: number) => {
    try {
      const res = await api.post(`/users/${user_id}/is_archived/`);
      console.log("User archived:", res);
      const refreshed = await api.get(`/users/${user_id}/`);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === user_id ? refreshed.data : user))
      );
      console.log(refreshed);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = (user_id: number) => {
    archivedUser(user_id);
  };

  if (!users || users.length === 0) {
    return <p>No users found.</p>; // Handle the case where no users are found
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="outline" className="ml-1">
              {" "}
              {users.length}{" "}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="working">
            Working
            <Badge variant="outline" className="ml-1 text-green-600">
              {" "}
              {working ? working.length : 0}{" "}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="resigned">
            Resigned{" "}
            <Badge variant="outline" className="ml-1 text-red-600">
              {" "}
              {resigned ? resigned.length : 0}{" "}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived{" "}
            <Badge variant="outline" className="ml-1">
              {" "}
              {archived ? archived.length : 0}{" "}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Link href="/users/create-user">
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add User
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>
              <div>User list</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">
                    Employee ID
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      {user.employee_id}
                    </TableCell>
                    <TableCell>
                      <strong className="text-md">
                        {user.full_name.toUpperCase()}
                      </strong>{" "}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link href={`mailto:${user.email}`}>
                        <div className="flex gap-1 align-middle text-center">
                          <Mail size={18} /> {user.email}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.is_working ? (
                          <div className="text-green-600">Working</div>
                        ) : (
                          <div className="text-red-600">Resigned</div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {user.is_staff ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline" size="sm">
                            <Ellipsis color="#222" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href={`/users/${user.id}`} passHref>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <a onClick={() => handleUserClick(user.id)}>
                              Archived
                            </a>
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="working">
        <Card>
          <CardHeader>
            <CardTitle>
              <div>User list</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">
                    Employee ID
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {working ? (
                  working.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="hidden sm:table-cell">
                        {user.employee_id}
                      </TableCell>
                      <TableCell>
                        <strong className="text-md">
                          {user.full_name.toUpperCase()}
                        </strong>{" "}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`mailto:${user.email}`}>
                          <div className="flex gap-1 align-middle text-center">
                            <Mail size={18} /> {user.email}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.is_working ? (
                            <div className="text-green-600">Working</div>
                          ) : (
                            <div className="text-red-600">Resigned</div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.is_staff ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="outline" size="sm">
                              <Ellipsis color="#222" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href={`/users/${user.id}`} passHref>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                                <a onClick={() => handleUserClick(user.id)}>
                                  Archived
                                </a>
                              </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No data available!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="resigned">
        <Card>
          <CardHeader>
            <CardTitle>
              <div>User list</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">
                    Employee ID
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resigned ? (
                  resigned.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="hidden sm:table-cell">
                        {user.employee_id}
                      </TableCell>
                      <TableCell>
                        <strong className="text-md">
                          {user.full_name.toUpperCase()}
                        </strong>{" "}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`mailto:${user.email}`}>
                          <div className="flex gap-1 align-middle text-center">
                            <Mail size={18} /> {user.email}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.is_working ? (
                            <div className="text-green-600">Working</div>
                          ) : (
                            <div className="text-red-600">Resigned</div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.is_staff ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="outline" size="sm">
                              <Ellipsis color="#222" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href={`/users/${user.id}`} passHref>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a onClick={() => handleUserClick(user.id)}>
                                Archived
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No data available!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="archived">
        <Card>
          <CardHeader>
            <CardTitle>
              <div>User list</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">
                    Employee ID
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archived
                  ? archived.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="hidden sm:table-cell">
                          {user.employee_id}
                        </TableCell>
                        <TableCell>
                          <strong className="text-md">
                            {user.full_name.toUpperCase()}
                          </strong>{" "}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Link href={`mailto:${user.email}`}>
                            <div className="flex gap-1 align-middle text-center">
                              <Mail size={18} /> {user.email}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.is_working ? (
                              <div className="text-green-600">Working</div>
                            ) : (
                              <div className="text-red-600">Resigned</div>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {user.is_staff ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserClick(user.id)}
                          >
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UsersList;
