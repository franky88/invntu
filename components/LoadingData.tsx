import { Skeleton } from "./ui/skeleton";

const LoadingData = () => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
      </div>
      <Skeleton className="h-[125px] w-full rounded-xl" />
    </div>
  );
};

export default LoadingData;
