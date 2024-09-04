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
import { Checkbox } from "@/components/ui/checkbox";

// Define the type for a form field
interface FormField {
  name: string;
  label: string;
  type: string; // Can be "text", "email", "select", "checkbox", etc.
  placeholder?: string;
  value: string | boolean; // Value can now be string or boolean for checkbox
  options?: { value: string; label: string }[]; // Options for select field
}

// Define the type for form props
interface ReusableFormProps {
  fields: FormField[];
  onSubmit: (formData: { [key: string]: string | boolean }) => void;
  buttonText: string | null;
  onCancel?: () => void; // Optional onCancel prop
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  onSubmit,
  buttonText,
  onCancel, // Destructure onCancel
}) => {
  // State to manage form data
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value || "" }),
      {}
    )
  );

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: "1rem" }}>
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "select" && field.options ? (
            <Select
              value={formData[field.name] as string}
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
          ) : field.type === "checkbox" ? (
            <div className="flex items-center">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={formData[field.name] as boolean}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, [field.name]: checked })
                }
              />
              <Label htmlFor={field.name} className="ml-2">
                {field.label}
              </Label>
            </div>
          ) : (
            <Input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] as string}
              onChange={handleInputChange}
            />
          )}
        </div>
      ))}
      <div className="flex space-x-2">
        <Button type="submit" className="float-right">
          {buttonText}
        </Button>
        {onCancel && (
          <Button
            className="float-right"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReusableForm;
