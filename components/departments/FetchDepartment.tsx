"use client";

import { GetDepartments } from "@/utils/api";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DepartmentProps {
  userValue: string;
  onChangeValue: (value: string) => void;
}

const FetchDepartment = ({ userValue, onChangeValue }: DepartmentProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartment = async () => {
    try {
      const response = await GetDepartments();
      setDepartments(response || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  return (
    <Select value={userValue} onValueChange={onChangeValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Department</SelectLabel>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.name}>
              {department.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FetchDepartment;
