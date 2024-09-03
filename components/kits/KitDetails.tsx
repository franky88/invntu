"use client";

import api from "@/utils/api";
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

interface History {
  changed_by: string;
  timestamp: Date; // or Date if already a Date object
  snapshot: {
    name: string;
    is_available: boolean;
  };
}

const KitDetails = () => {
  const { kitId } = useParams();
  const [kit, setKit] = useState<Kit | null>(null);
  const [history, setHistory] = useState<History[]>([]);

  const getKit = async () => {
    console.log("kit ID", kitId);
    try {
      const res = await api.get(`/kits/${kitId}/`);
      console.log("Kit details", res.data);

      // Convert `timestamp` strings to Date objects
      const kitData = res.data;
      kitData.history = kitData.history.map((hist: any) => ({
        ...hist,
        timestamp: new Date(hist.timestamp),
      }));

      setKit(res.data);
      setHistory(res.data.history);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getKit();
  }, [kitId]);
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Kit Details</CardTitle>
          </CardHeader>
          <CardContent>{kit ? kit.name : "Loading..."}</CardContent>
        </Card>
      </div>
      <div>
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
  );
};

export default KitDetails;
