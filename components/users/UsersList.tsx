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
} from "@/components/ui/dropdown-menu";

import { Badge } from "../ui/badge";

// Define User type if not already defined

const UsersList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users");
        console.log(res.data.results);
        setUsers(res.data.results);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display a loading message while fetching data
  }

  if (!users || users.length === 0) {
    return <p>No users found.</p>; // Handle the case where no users are found
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">Employee ID</TableHead>
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
              <strong className="text-md">{user.full_name}</strong> <br />
              <Link href={`mailto:${user.email}`}>
                <div className="flex gap-1 align-middle text-center">
                  <Mail size={18} /> {user.email}
                </div>
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {user.is_active ? (
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
                  <Ellipsis color="#222" />
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
                    <Link href="#" passHref>
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;
