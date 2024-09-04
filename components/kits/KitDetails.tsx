"use client";

import api, { GetItems } from "@/utils/api";
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
import { ChevronLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const KitDetails = () => {
  const { kitId } = useParams();
  const id = Number(kitId);
  const [kit, setKit] = useState<Kit | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [history, setHistory] = useState<History[]>([]);

  const fetchKit = async () => {
    try {
      const response = await GetKit(id);
      console.log("Kit details", response?.history);

      // Convert `timestamp` strings to Date objects
      const transformedHistory = response?.history.map((hist: any) => ({
        ...hist,
        timestamp: new Date(hist.timestamp),
      }));

      setKit(response || null);
      setHistory(transformedHistory || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await GetItems();
      if (response) {
        // Filter items that belong to the unit kits
        const unitKitItems = response.filter(
          (item: Item) => item.unit_kit === id
        );
        setFilteredItems(unitKitItems);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKit();
    fetchItems();
  }, [id]);
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
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kit Details</CardTitle>
            </CardHeader>
            <CardContent>{kit ? kit.name : "Loading..."}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Items details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Serial</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.serial}</TableCell>
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
                  <div>
                    {hist.changed_by} <br />
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
    </div>
  );
};

export default KitDetails;
