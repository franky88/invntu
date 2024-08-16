"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FormEvent,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

// Define the shape of the user data based on JWT payload
interface User {
  id: number;
  username: string;
  email: string;
  // Add more fields based on your JWT token payload structure
}

interface AuthTokens {
  access: string;
  refresh: string;
}

// Define the shape of the context state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authTokens: AuthTokens | null;
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
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    typeof window !== "undefined" && localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("authTokens");
    if (accessToken) {
      const decodedUser = jwtDecode<User>(accessToken);
      console.log("authtokens from localstorage: ", decodedUser);
      console.log("localstorage token: ", authTokens);
      setUser(decodedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/token", { email, password });
      console.log("login token: ", response.data);
      setAuthTokens(response.data);
      const decodedUser = jwtDecode<User>(response.data.access);
      setUser(decodedUser);
      localStorage.setItem("authTokens", JSON.stringify(response.data.access));
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    router.push("/login");
  };

  // Token refresh logic (optional)
  useEffect(() => {
    const updateToken = async () => {
      if (authTokens) {
        try {
          const response = await api.post("/auth/token/refresh/", {
            refresh: authTokens.refresh,
          });
          console.log("update token response: ", response.data);
          setAuthTokens(response.data);
          localStorage.setItem(
            "authTokens",
            JSON.stringify(response.data.access)
          );
          const decodedUser = jwtDecode<User>(response.data.access);
          setUser(decodedUser);
        } catch (error) {
          logout();
        }
      }
    };

    const interval = setInterval(updateToken, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, loading, authTokens, login, logout }}>
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
