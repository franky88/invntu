import Link from "next/link";
import UsersList from "@/components/users/UsersList";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import CreateUser from "@/components/users/CreateUser";

const userPage = async () => {
    return (
        <div className="flex gap-5">
            <div className="w-1/4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Create new user
                    </CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                    <CreateUser />
                </CardContent>
            </Card>
            </div>
            <div className="w-3/4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            User list
                            {/* <Link href='/users/create-user' className="float-right">
                                    <Button variant='default' className="flex gap-2">
                                        <UserRound size={16} color="#fff"/> Create user
                                    </Button>
                                </Link> */}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="card-body">
                        <UsersList/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default userPage