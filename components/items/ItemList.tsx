import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";

import { Ellipsis } from "lucide-react";

import api from "@/utils/api";

const ItemList = async () => {
  const res = await api.get<ApiResponse<Item>>("units/");
  const items = res.data.results;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Model</TableHead>
          <TableHead className="hidden sm:table-cell">Serials</TableHead>
          <TableHead className="hidden sm:table-cell">Cost</TableHead>
          <TableHead className="hidden sm:table-cell">Date purchased</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.model}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {item.serial}
            </TableCell>
            <TableCell className="hidden sm:table-cell">{item.cost}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {item.date_purchased}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis color="#222" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/items/${item.id}`} legacyBehavior passHref>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#" legacyBehavior passHref>
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ItemList;
