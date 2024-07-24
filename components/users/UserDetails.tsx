'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from "@/utils/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${userId}/`);
                const data = res.data
                setUser(data);
                console.log(data)
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <Card className='mt-5'>
            <CardHeader>
                <CardTitle>{user.get_full_name ? "" : user.username }</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Email: {user.email}</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    );
};

export default UserDetails;
