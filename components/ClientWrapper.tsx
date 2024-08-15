"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const noLayoutRoutes = ["/login", "/register"];

  const shouldExcludeLayout = noLayoutRoutes.includes(pathname);

  return (
    <>
      {shouldExcludeLayout ? (
        <>{children}</>
      ) : (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientWrapper;
