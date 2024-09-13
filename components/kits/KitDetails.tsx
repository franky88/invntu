"use client";

import api, { GetAvailableItems, GetUnitStatuses, GetKits } from "@/utils/api";
import { GetKit } from "@/utils/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ChevronLeft, Pencil, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ReusableForm from "../ReusableForm";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAuth } from "@/context/AuthContext";

const KitDetails = () => {
  const { kitId } = useParams();
  const id = Number(kitId);
  const [kit, setKit] = useState<Kit | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [unitItemSet, setUnitItemSet] = useState<Item[]>([]);
  const [itemStatus, setItemStatus] = useState<UnitStatus[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenUpdate, setIsDialogOpenUpdate] = useState(false);
  const [isAlertDialogOpenDelete, setIsAlertDialogOpenDelete] = useState(false);
  const [isAlertDialogOpenRemove, setIsAlertDialogOpenRemove] = useState(false);
  const [unitToRemove, setUnitToRemove] = useState<number | null>(null);
  const [unitToUpdate, setUnitToUpdate] = useState<Item | null>(null);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [isDelete, setIsDelete] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchKit = async () => {
    try {
      const response = await GetKit(id);
      const transformedHistory =
        response?.history.map((hist: any) => ({
          ...hist,
          timestamp: new Date(hist.timestamp),
        })) || [];

      const units = await api.get(`/kits/${id}/get_all_units/`);
      const unitData = units.data;

      console.log(unitData);

      try {
        const belong = await api.get(`/kits/${id}/kit_unit_belong_to/`);
        const belongData = belong.data;

        console.log(belongData.assign_to);

        const user = await api.get(`/users/${belongData.assign_to}/`);
        console.log(user.data);
      } catch (error) {
        console.error(error);
      }

      setIsDelete(unitData.length === 0);
      setKit(response || null);
      setHistory(transformedHistory);
      setFilteredItems(unitData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnitItemSet = async () => {
    try {
      const response = await GetAvailableItems();
      setUnitItemSet(response || []);
      console.log("working items: -> ", unitItemSet);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItemStatus = async () => {
    try {
      const response = await GetUnitStatuses();
      setItemStatus(response || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKit();
    fetchUnitItemSet();
    fetchItemStatus();
  }, [id]);

  const handleSubmit = async (formData: {
    [key: string]: string | boolean;
  }) => {
    try {
      const payload = {
        ...formData,
        unit_kit: kit?.id,
        item: formData.item ? parseInt(formData.item as string, 10) : null,
      };

      await api.post("/units/", payload);

      if (payload.item) {
        await api.post(`/items/${payload.item}/update_quantity_sub/`);
      }

      await fetchKit();
      await fetchUnitItemSet();

      let currentDate = new Date().toJSON().slice(0, 10);
      toast({
        title: `Unit ${formData.name} added successfully!`,
        description: `Added ${currentDate}`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseAlertDialogDelete = () => {
    setIsAlertDialogOpenDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (id !== null) {
      try {
        await api.delete(`/kits/${id}/`);
        await GetKits();
        await fetchUnitItemSet();

        handleCloseAlertDialogDelete();

        router.push("/kits");

        let currentDate = new Date().toJSON().slice(0, 10);
        toast({
          title: `Kit successfully deleted!`,
          description: `Deleted ${currentDate}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOpenAlertDialogRemove = async (
    unitId: number,
    itemId: number
  ) => {
    setUnitToRemove(unitId);
    setItemToRemove(itemId);
    setIsAlertDialogOpenRemove(true);
  };

  const handleCloseAlertDialogRemove = () => {
    setIsAlertDialogOpenRemove(false);
    setUnitToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (unitToRemove !== null) {
      try {
        if (itemToRemove !== null) {
          await api.post(`/items/${itemToRemove}/update_quantity_add/`);
        }
        await api.delete(`/units/${unitToRemove}/`);
        await fetchKit();
        await fetchUnitItemSet();

        await api.get(`/kits/${id}/get_all_units/`);
        handleCloseAlertDialogRemove();

        let currentDate = new Date().toJSON().slice(0, 10);
        toast({
          title: `Unit successfully deleted!`,
          description: `Deleted ${currentDate}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOpenDialogUpdate = async (unitId: number) => {
    try {
      const response = await api.get(`/units/${unitId}/`);
      setUnitToUpdate(response.data || null);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsDialogOpenUpdate(true);
  };

  const handleConfirmUpdate = async (formData: {
    [key: string]: string | boolean;
  }) => {
    if (unitToUpdate !== null) {
      try {
        await api.put(`/units/${unitToUpdate.id}/`, {
          serial: formData.serial,
        });

        await fetchKit();
        await fetchUnitItemSet();

        let currentDate = new Date().toJSON().slice(0, 10);
        toast({
          title: `Unit serial ${formData.serial} updated successfully!`,
          description: `Updated ${currentDate}`,
        });

        setIsDialogOpenUpdate(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsDialogOpenUpdate(false);
      }
    }
  };

  return (
    <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/kits">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Kit details
        </h1>
        <div className="items-center gap-2 md:ml-auto md:flex">
          {isDelete ? (
            <Button
              variant="destructive"
              size="sm"
              className="h-7"
              onClick={() => setIsAlertDialogOpenDelete(true)}
            >
              Delete
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="sm" className="h-7">
                    Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove all units to delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kit Details</CardTitle>
            </CardHeader>
            <CardContent>
              {kit ? kit.name.toUpperCase() : "Loading..."}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle>Items details</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto h-7 gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add unit
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add unit</DialogTitle>
                      <DialogDescription>
                        <ReusableForm
                          fields={[
                            {
                              name: "item",
                              label: "Item",
                              type: "select",
                              placeholder: "Select a item",
                              options: unitItemSet.map((item: any) => ({
                                value: item.id.toString(),
                                label: item.name.toLocaleUpperCase(),
                              })),
                              value: "",
                            },
                            {
                              name: "serial",
                              label: "Serial",
                              type: "text",
                              placeholder: "Enter serial number",
                              value: "",
                            },
                          ]}
                          onSubmit={handleSubmit}
                          buttonText="Add unit"
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Serial</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell>
                        <div className="flex align-middle">
                          {item.serial}
                          {user?.is_superuser && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-5 mr-2"
                              onClick={() => handleOpenDialogUpdate(item.id)}
                            >
                              <Pencil className="w-4 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 mr-2 text-orange-500"
                        >
                          Report issue
                        </Button>
                        {user?.is_superuser && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 mr-2"
                            onClick={() =>
                              handleOpenAlertDialogRemove(item.id, item.item)
                            }
                          >
                            X
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kit history</CardTitle>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-60">
                {history.map((hist) => (
                  <div key={hist.id}>
                    {hist.change_by} <br />
                    <small className="text-gray-400">
                      {hist.timestamp.toDateString()}
                    </small>
                    <br />
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="link" className="text-blue-500">
                          Snapshot
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="flex flex-col justify-between gap-3 space-x-4 bg-white p-5 rounded-md shadow-md">
                          <strong>Snapshot</strong>
                          {hist.snapshot.name}
                          {hist.snapshot.is_available}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
              </ScrollArea>
              <Separator orientation="horizontal" />
            </CardContent>
          </Card>
        </div>
      </div>

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

      {/* Alert Dialog for remove unit confirmation */}
      <AlertDialog
        open={isAlertDialogOpenRemove}
        onOpenChange={setIsAlertDialogOpenRemove}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              unit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlertDialogRemove}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={handleConfirmRemove}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpenUpdate} onOpenChange={setIsDialogOpenUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit serial</DialogTitle>
            <DialogDescription>
              <ReusableForm
                fields={[
                  {
                    name: "serial",
                    label: "Serial",
                    type: "text",
                    placeholder: "Enter serial number",
                    value: unitToUpdate?.serial || "",
                  },
                ]}
                onSubmit={handleConfirmUpdate}
                buttonText="Save"
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitDetails;
