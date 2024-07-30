import { Button } from "./ui/button";

interface ChildComponentProps {
  onDataSend: (data: string) => void;
}

const SampleChild = ({ onDataSend }: ChildComponentProps) => {
  const sendDataToParent = () => {
    const data = "Hello from Child";
    onDataSend(data);
  };
  return <Button onClick={sendDataToParent}>Send data to parent</Button>;
};

export default SampleChild;
