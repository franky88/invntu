import React from 'react';
import CreateUser from '@/components/users/CreateUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const AddUserPage = () => {
  return (
    <Card className='card bg-neutral w-1/3'>
      <CardHeader>
        <CardTitle>
          <div>Create user</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateUser />
      </CardContent>
    </Card>
  );
}

export default AddUserPage;
