"use client";

import { useAuth } from "@/context/AuthContext";

const page = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        WELCOME, {user.first_name.toUpperCase()}!
      </h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default page;
