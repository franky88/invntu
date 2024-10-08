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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { File, ListFilter, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { GetAllUsers } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

// Define User type if not already defined

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [working, setWorking] = useState<User[]>([]);
  const [resigned, setResigned] = useState<User[]>([]);
  const [archived, setArchived] = useState<User[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    await Promise.all([
      getAllUsers(),
      getWorkingUsers(),
      getResignedUsers(),
      getArchivedUsers(),
    ]);
  };

  const checkAdminUser = () => {
    if (user?.is_superuser) {
      setIsAdminUser(true);
    } else {
      setIsAdminUser(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkAdminUser();
  }, []);

  const getAllUsers = async () => {
    try {
      const users = await GetAllUsers();
      setUsers(users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getWorkingUsers = async () => {
    try {
      const res = await api.get<{ results: User[] }>("/users/working/");
      setWorking(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const getResignedUsers = async () => {
    try {
      const res = await api.get<{ results: User[] }>("/users/resigned/");
      setResigned(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const getArchivedUsers = async () => {
    try {
      const res = await api.get<{ results: User[] }>("/users/archived/");
      setArchived(res.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const archivedUser = async (user_id: number) => {
    try {
      await api.put(`/users/${user_id}/is_archived/`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = (user_id: number) => {
    archivedUser(user_id);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(query) ||
        user.employee_id.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setSearchUsers(filteredUsers);
  };

  if (!users || users.length === 0) {
    return <p>No users found.</p>; // Handle the case where no users are found
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center gap-3">
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
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                name="search"
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>
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
                {(searchUsers.length > 0 ? searchUsers : users).map((user) => (
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
                      {isAdminUser ? (
                        <Link href={`/users/${user.id}`} passHref>
                          <Button variant="outline" size="sm" className="h-7">
                            Edit
                          </Button>
                        </Link>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="sm" className="h-7">
                                Edit
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Ask admin for permisions
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
                  (searchUsers.length > 0 ? searchUsers : working).map(
                    (user) => (
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
                          {isAdminUser ? (
                            <Link href={`/users/${user.id}`} passHref>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7"
                              >
                                Edit
                              </Button>
                            </Link>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7"
                                  >
                                    Edit
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Ask admin for permisions
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )
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
                        <Link href={`/users/${user.id}`} passHref>
                          <Button variant="outline" className="h-7 mr-3">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => handleUserClick(user.id)}
                          className="h-7"
                        >
                          Archived
                        </Button>
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
                          {isAdminUser ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7"
                              onClick={() => handleUserClick(user.id)}
                            >
                              Restore
                            </Button>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7"
                                  >
                                    Restore
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Ask admin for permissions
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
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
