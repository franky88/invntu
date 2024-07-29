import { Button } from "@/components/ui/button";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      {children}
    </div>
  );
};

export default layout;
