"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Define the shape of the user data based on JWT payload
interface User {
  id: number;
  username: string;
  email: string;
  // Add more fields based on your JWT token payload structure
}

// Define the shape of the context state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create a default value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const token = Cookies.get("token");
      try {
        console.log("Token from cookies", JSON.stringify(token));
        const response = await api.get("/current-user", {
          headers: {
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          withCredentials: true,
        });
        console.log("Fetch user response:", response);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(
        "/auth/token",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login response:", response);

      if (response.status === 200) {
        Cookies.set("token", response.data.access);
        try {
          const userResponse = await api.get("/current-user", {
            headers: {
              Authorization: `Bearer ${response.data.access}`,
            },
            withCredentials: true,
          });
          console.log("User data after login:", userResponse.data);
          setUser(userResponse.data);
          router.push("/");
        } catch (error) {
          console.error("Login failed", error);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
