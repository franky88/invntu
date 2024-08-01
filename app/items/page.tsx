import api from "@/utils/api";
import ReusableTable from "@/components/ReusableTable";

const page = async () => {
  const items = await api.get("/units");
  const data = items.data.results;
  console.log(data);

  const col = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "model", label: "Model" },
    { key: "serials", label: "Serials" },
    { key: "date_purchased", label: "Date purchased" },
    { key: "cost", label: "Cost" },
  ];
  return (
    <div>
      Item page
      <ReusableTable columns={col} data={data} />
    </div>
  );
};

export default page;
