"use client";

import { useState, FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for a form field
interface FormField {
  name: string;
  label: string;
  type: string; // Can be "text", "email", "select", etc.
  placeholder?: string;
  value: string;
  options?: { value: string; label: string }[]; // Options for select field
}

// Define the type for form props
interface ReusableFormProps {
  fields: FormField[];
  onSubmit: (formData: { [key: string]: string }) => void;
  buttonText: string;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  onSubmit,
  buttonText,
}) => {
  // State to manage form data
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value || "" }),
      {}
    )
  );

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: "1rem" }}>
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "select" && field.options ? (
            <Select
              value={formData[field.name]}
              onValueChange={(value) =>
                setFormData({ ...formData, [field.name]: value })
              }
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
            />
          )}
        </div>
      ))}
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default ReusableForm;
