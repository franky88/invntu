"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReusableForm from "../ReusableForm";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { PlusCircle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { GetKits, GetAllUsers } from "@/utils/api";
import Link from "next/link";
import { on } from "events";

const KitList = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlertDialogOpenAssign, setIsAlertDialogOpenAssign] = useState(false);
  const [isAlertDialogOpenDelete, setIsAlertDialogOpenDelete] = useState(false);
  const [isAlertDialogOpenReturn, setIsAlertDialogOpenReturn] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [kitIdToAssign, setKitIdToAssign] = useState<number | null>(null);
  const [kitIdToDelete, setKitIdToDelete] = useState<number | null>(null);
  const [kitIdToReturn, setKitIdToReturn] = useState<number | null>(null);

  const getAllKits = async () => {
    try {
      const response = await GetKits();
      setKits(response || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await GetAllUsers();
      setUsers(response || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllKits();
    getUsers();
  }, []);

  const handleSubmit = async (formData: { [key: string]: string }) => {
    try {
      await api.post("/kits/", { name: formData.name });
      const res = await api.get("/kits");
      setKits(res.data.results);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUpdate = async (formData: { [key: string]: string }) => {
    if (editingKit) {
      try {
        await api.put(`/kits/${editingKit.id}/`, { name: formData.name });

        const res = await api.get("/kits");
        setKits(res.data.results);

        // Close the dialog after successful submission
        setIsEditDialogOpen(false);
        setEditingKit(null); // Clear the editing kit
      } catch (error) {
        console.error(error);
      } finally {
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleOpenAlertDialogAssign = (kitId: number) => {
    setKitIdToAssign(kitId);
    setIsAlertDialogOpenAssign(true);
    console.log(kitIdToDelete);
  };

  const handleCloseAlertDialogAssign = () => {
    setIsAlertDialogOpenAssign(false);
    setKitIdToDelete(null);
  };

  const handleConfirmAssign = async (formData: { [key: string]: string }) => {
    try {
      await api.post("/assignments", {
        unit_kit: kitIdToAssign,
        assign_to: formData.assign_to,
        date_assigned: formData.date_assigned,
      });
      await getAllKits();
      handleCloseAlertDialogAssign();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAlertDialogDelete = (kitId: number) => {
    setKitIdToDelete(kitId);
    setIsAlertDialogOpenDelete(true);
    console.log(kitIdToDelete);
  };

  const handleCloseAlertDialogDelete = () => {
    setIsAlertDialogOpenDelete(false);
    setKitIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    console.log(kitIdToDelete);
    if (kitIdToDelete !== null) {
      try {
        const res = await api.delete(`/kits/${kitIdToDelete}`);
        await getAllKits();
        handleCloseAlertDialogDelete();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOpenAlertDialogReturn = (kitId: number) => {
    setKitIdToReturn(kitId);
    setIsAlertDialogOpenReturn(true);
    console.log(kitIdToDelete);
  };

  const handleCloseAlertDialogReturn = () => {
    setIsAlertDialogOpenReturn(false);
    setKitIdToReturn(null);
  };

  const handleConfirmReturn = async () => {
    console.log(kitIdToReturn);
    if (kitIdToReturn !== null) {
      try {
        const res = await api.post(`/assignments/${kitIdToReturn}/returned`);
        await getAllKits();
        handleCloseAlertDialogReturn();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          {/* Dialog for adding a kit */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Kit
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add kit</DialogTitle>
                <DialogDescription>
                  <ReusableForm
                    fields={[
                      {
                        name: "name",
                        label: "Name",
                        type: "text",
                        placeholder: "Enter name",
                        value: "",
                      },
                    ]}
                    onSubmit={handleSubmit}
                    buttonText="Add kit"
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Dialog for editing a kit */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <div></div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update kit</DialogTitle>
                <DialogDescription>
                  <ReusableForm
                    fields={[
                      {
                        name: "name",
                        label: "Name",
                        type: "text",
                        placeholder: "Enter name",
                        value: editingKit?.name || "",
                      },
                    ]}
                    onSubmit={handleSubmitUpdate}
                    buttonText="Save"
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>
              <div>Kit list</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Kit Code</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kits.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex align-middle">
                        {item.name}
                        <Button
                          variant="link"
                          size="sm"
                          className="h-5"
                          onClick={() => {
                            setEditingKit(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 text-green-500" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.kit_code}</TableCell>
                    <TableCell>{item.is_available ? "Yes" : "Not"}</TableCell>
                    <TableCell>
                      <Link href={`/kits/${item.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 mr-3"
                        >
                          Details
                        </Button>
                      </Link>

                      {item.is_available ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 mr-3 text-green-500"
                          onClick={() => handleOpenAlertDialogAssign(item.id)}
                        >
                          Assign
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 mr-3 text-orange-500"
                          onClick={() => handleOpenAlertDialogReturn(item.id)}
                        >
                          Return
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7"
                        onClick={() => handleOpenAlertDialogDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Alert Dialog for delete confirmation */}
      <AlertDialog
        open={isAlertDialogOpenDelete}
        onOpenChange={setIsAlertDialogOpenDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              kit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlertDialogDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={handleConfirmDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for returned confirmation */}
      <AlertDialog
        open={isAlertDialogOpenReturn}
        onOpenChange={setIsAlertDialogOpenReturn}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return the kit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will return the kit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlertDialogReturn}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReturn}>
              Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for assign confirmation */}
      <AlertDialog
        open={isAlertDialogOpenAssign}
        onOpenChange={setIsAlertDialogOpenAssign}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign kit</AlertDialogTitle>
            <AlertDialogDescription>
              <ReusableForm
                fields={[
                  {
                    name: "assign_to",
                    label: "Assign to",
                    type: "select",
                    placeholder: "Select a item status",
                    options: users.map((user) => ({
                      value: user.id.toString(),
                      label: user.full_name,
                    })),
                    value: "",
                  },
                  {
                    name: "date_assigned",
                    label: "Date assigned",
                    type: "date",
                    value: "",
                  },
                ]}
                onSubmit={handleConfirmAssign}
                buttonText="Assign"
                onCancel={handleCloseAlertDialogAssign}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
};

export default KitList;
