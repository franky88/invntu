'use client'

import { useState } from 'react';
import api from '@/utils/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/', { 
                'username': username, 
                'first_name': firstname, 
                'last_name': lastname, 
                'email': email 
            });
            setMessage('User sucessfully created!');
            console.log(res.data)
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                setMessage(`Failed to create user: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                // Request was made but no response was received
                console.error('Request data:', error.request);
                setMessage('Failed to create user: No response from server');
            } else {
                // Something else caused the error
                console.error('Error message:', error.message);
                setMessage(`Failed to create user: ${error.message}`);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <Input
                type="text"
                value={username}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="text"
                value={firstname}
                placeholder='First name'
                onChange={(e) => setFirstname(e.target.value)}
            />
            <Input
                type="text"
                value={lastname}
                placeholder='Last name'
                onChange={(e) => setLastname(e.target.value)}
            />
            <Input
                type="email"
                value={email}
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="default">Create User</Button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default CreateUser;
