import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex justify-center items-center py-12", className)}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};
