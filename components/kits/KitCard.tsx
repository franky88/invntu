"use client";

import { useEffect, useState, useCallback } from "react";
import api, { GetUser } from "@/utils/api";
import { Monitor, PlusCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { formatDate } from "@/utils/formatDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
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
import { useToast } from "@/hooks/use-toast";

interface KitProps {
  userID: number;
}

const KitCard = ({ userID }: KitProps) => {
  const [unitAssign, setUnitAssign] = useState<KitAssignment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [kitIdToReturn, setKitIdToReturn] = useState<number | null>(null);
  const [isAlertDialogOpenReturn, setIsAlertDialogOpenReturn] = useState(false);
  const { toast } = useToast();

  const fetchAssignment = useCallback(async () => {
    try {
      const unit = await api.get(`/users/${userID}/unit_assignment/`);
      if (unit) {
        const unitData = unit.data;
        setUnitAssign(unitData);
        console.log("unit Data: ", unitData);

        const unitKitIds = unitData
          .map((unit: KitAssignment) => unit.unit_kit)
          .filter((kitId: number | null) => kitId !== null) as number[];

        if (unitKitIds.length > 0) {
          try {
            const responses = await Promise.all(
              unitKitIds.map((kitId) =>
                api.get(`/kits/${kitId}/get_unit_list/`)
              )
            );
            const allUnits = responses.flatMap(
              (response) => response.data || []
            );
            setUnits(allUnits);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setUnitAssign([]);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [userID]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleOpenAlertDialogReturn = (kitId: number) => {
    setKitIdToReturn(kitId);
    setIsAlertDialogOpenReturn(true);
  };

  const handleCloseAlertDialogReturn = () => {
    setIsAlertDialogOpenReturn(false);
    setKitIdToReturn(null);
  };

  const handleConfirmReturn = async () => {
    if (kitIdToReturn !== null) {
      try {
        await api.put(`/kits/${kitIdToReturn}/return_assign_unit_kit/`);

        await fetchAssignment();

        console.log("unit assign: ---> ", unitAssign);
        console.log("is unit assign: ---> ", (unitAssign.length = 0));

        if (unitAssign.length < 0) {
          setUnitAssign([]);
        }

        handleCloseAlertDialogReturn();

        const currentDate = new Date().toJSON().slice(0, 10);
        toast({
          title: `Kit returned successfully!`,
          description: `Returned ${currentDate}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  console.log(unitAssign);

  return (
    <>
      {Array.isArray(unitAssign) && unitAssign.length > 0 ? (
        <div>
          {unitAssign.map((unit) => (
            <div key={unit.id} className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="bg-slate-300 p-4 rounded-sm">
                  <Monitor />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <strong>{unit.unit_kit_name}</strong>
                    </div>
                    <Button
                      className="h-7 text-orange-400 ml-auto"
                      variant="link"
                      type="button"
                      onClick={() => handleOpenAlertDialogReturn(unit.unit_kit)}
                    >
                      Return
                    </Button>
                  </div>

                  <Separator />
                  <div className="flex flex-col">
                    <small className="">
                      Code: <b>{unit.unit_kit_code}</b>
                    </small>
                    <small className="text-slate-500">
                      Date assigned: {formatDate(unit.date_assigned)}
                    </small>
                  </div>
                </div>
              </div>
              <div className="flex gap-2"></div>
            </div>
          ))}
          <Button
            className="h-7"
            variant="outline"
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            View items
          </Button>
        </div>
      ) : (
        <strong>No unit assigned</strong>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item list</DialogTitle>
            <DialogDescription>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Item name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Serial</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(units != null ? units : []).map((unit, index) => (
                    <TableRow key={unit.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{unit.item_name}</TableCell>
                      <TableCell>{unit.item_category_name}</TableCell>
                      <TableCell>{unit.serial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default KitCard;
