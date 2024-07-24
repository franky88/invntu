'use client'

interface TextInputProps {
  placeholder: string;
  type: string;
}

const TextInput = ({ placeholder, type }: TextInputProps) => {
  return (
    <input type={type} placeholder={placeholder} className="input w-full" />
  );
};

export default TextInput;
