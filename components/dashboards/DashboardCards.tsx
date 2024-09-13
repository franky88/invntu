import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface DashboardCardsProps {
  title: string;
  total: number;
  currentDate: string;
}

const DashboardCards = ({ title, total, currentDate }: DashboardCardsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total}</div>
        <p className="text-xs text-muted-foreground">as of {currentDate}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCards;
