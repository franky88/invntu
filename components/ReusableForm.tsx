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
  type: string;
  placeholder?: string;
  value: string | boolean;
  options?: { value: string; label: string }[];
}

interface ReusableFormProps {
  fields: FormField[];
  onSubmit: (formData: { [key: string]: string | boolean }) => void;
  buttonText: string | null;
  onCancel?: () => void;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  onSubmit,
  buttonText,
  onCancel,
}) => {
  // State to manage form data
  const [formData, setFormData] = useState<{
    [key: string]: string | boolean;
  }>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value || "" }),
      {}
    )
  );

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: ".2rem" }}>
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
