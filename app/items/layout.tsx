import ProtectedRoute from "@/components/ProtectedRoute";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <div>{children}</div>
    </ProtectedRoute>
  );
};

export default layout;
