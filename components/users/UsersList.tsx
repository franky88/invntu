import api from "@/utils/api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UsersList = async () => {
  const res = await api.get<ApiResponse<User>>("users/");
  const users = res.data.results;
  console.log(users);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">Employee ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Staff</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="hidden sm:table-cell">
              {user.employee_id}
            </TableCell>
            <TableCell>
              <strong className="text-md">{user.full_name}</strong> <br />
              <Link href={`mailto:${user.email}`}>
                <div className="flex gap-1 align-middle text-center">
                  <span>
                    <Mail size={18} />
                  </span>{" "}
                  {user.email}
                </div>
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
            <TableCell>{user.status ?? "Employed"}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {user.is_staff ? "Yes" : "No"}
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
                    <Link href={`/users/${user.id}`} legacyBehavior passHref>
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

export default UsersList;
