import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentList from "@/components/departments/DepartmentList";

const page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <DepartmentList></DepartmentList>
      </CardContent>
    </Card>
  );
};

export default page;
