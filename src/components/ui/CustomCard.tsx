
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CustomCardProps {
  className?: string;
  children: ReactNode;
}

const CustomCard = ({ className, children }: CustomCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CustomCardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
    >
      {children}
    </div>
  );
};

export const CustomCardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h3
      className={cn(
        "font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CustomCardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  );
};

export const CustomCardContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
};

export const CustomCardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
    >
      {children}
    </div>
  );
};

export default CustomCard;
