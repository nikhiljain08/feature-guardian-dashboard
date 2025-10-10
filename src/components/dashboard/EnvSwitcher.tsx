
import { Badge } from "@/components/ui/badge";
import { Environment } from "@/types";
import { cn } from "@/lib/utils";

interface EnvSwitcherProps {
  environment: Environment;
  onEnvironmentChange?: (environment: Environment) => void; // Made optional since we're not using it
}

const environments = [
  {
    value: "development",
    label: "Development",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "staging",
    label: "Staging", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "production",
    label: "Production",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const EnvSwitcher = ({ environment }: EnvSwitcherProps) => {
  const currentEnv = environments.find((env) => env.value === environment);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-2 px-3 py-1 font-medium",
        currentEnv?.color
      )}
    >
      <div className="h-2 w-2 rounded-full bg-current opacity-60" />
      {currentEnv?.label || "Unknown"}
    </Badge>
  );
};

export default EnvSwitcher;
