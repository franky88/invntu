"use client";

import { GetUser } from "@/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { formatDate } from "@/utils/formatDate";

interface kitAssignToProps {
  userID: number;
}

const KitAssignTo = ({ userID }: kitAssignToProps) => {
  const [assignTo, setAssignTo] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserAssigned = async () => {
      try {
        const user = await GetUser(userID);
        if (user !== null) {
          setAssignTo(user || null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserAssigned();
  }, [userID]);
  return (
    <>
      <div className="flex flex-row gap-3">
        <div>
          <Avatar>
            <AvatarImage
              src={assignTo?.image}
              alt={`${assignTo?.full_name} profile`}
            />
            <AvatarFallback>PI</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <strong>{assignTo?.full_name}</strong>
          <Separator orientation="horizontal" />
          <small>
            <b>{assignTo?.position}</b>
          </small>
          {/* <small>ID Number: {assignTo?.employee_id}</small>
          <small>{assignTo?.email}</small> */}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        {/* <Link href={`/users/${assignTo?.id}`}>
          <Button variant={"outline"} className="h-7">
            User details
          </Button>
        </Link> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="h-7">
              User details
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <strong className="text-slate-500">User details</strong>
              <div className="flex flex-col mt-5">
                <div className="flex flex-col">
                  <small className="text-slate-500">Personal info</small>
                  <Separator />
                  <strong>{assignTo?.full_name.toUpperCase()}</strong>
                  <small>
                    Birth date:{" "}
                    {assignTo?.birth_date
                      ? formatDate(assignTo?.birth_date)
                      : "Unkown"}
                  </small>
                  <small>
                    Contact: {assignTo?.contact ? assignTo?.contact : "Unknown"}
                  </small>
                </div>
                <div className="flex flex-col mt-3">
                  <small className="text-slate-500">Employment info</small>
                  <Separator />
                  <div>
                    <strong>{assignTo?.position.toUpperCase()}</strong>
                  </div>
                  {assignTo?.is_working ? (
                    <small className="text-green-500">Status: Working</small>
                  ) : (
                    <small className="text-orange-500">Status: Resigned</small>
                  )}
                  <small>
                    ID number:{" "}
                    {assignTo?.employee_id ? assignTo?.employee_id : "Unkown"}
                  </small>
                  <small>
                    Department:{" "}
                    {assignTo?.department ? assignTo?.department : "Unknown"}
                  </small>
                </div>
                <div className="flex mt-3">
                  <Link href={`/users/${assignTo?.id}`}>
                    <Button variant={"outline"} className="h-7">
                      View user
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant={"outline"} className="h-7 text-orange-400">
          Return
        </Button>
      </div>
    </>
  );
};

export default KitAssignTo;
