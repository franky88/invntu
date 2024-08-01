import ReusableTable from "@/components/ReusableTable";
import api from "@/utils/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const page = async () => {
  const items = await api.get("/department");
  const data = items.data.results;

  const col = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <ReusableTable columns={col} data={data} />
      </CardContent>
    </Card>
  );
};

export default page;
