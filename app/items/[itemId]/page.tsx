import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ItemDetails from "@/components/items/ItemDetails";

const page = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link href="/items">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Update Item
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Active
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ItemDetails />
        </div>
      </div>
    </>
  );
};

export default page;
