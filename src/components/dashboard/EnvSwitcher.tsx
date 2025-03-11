
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Environment } from "@/types";
import { cn } from "@/lib/utils";

interface EnvSwitcherProps {
  environment: Environment;
  onEnvironmentChange: (environment: Environment) => void;
}

const environments = [
  {
    value: "development",
    label: "Development",
    color: "bg-info text-info-foreground",
  },
  {
    value: "staging",
    label: "Staging",
    color: "bg-warning text-warning-foreground",
  },
  {
    value: "production",
    label: "Production",
    color: "bg-destructive text-destructive-foreground",
  },
];

const EnvSwitcher = ({ environment, onEnvironmentChange }: EnvSwitcherProps) => {
  const [open, setOpen] = useState(false);

  const currentEnv = environments.find((env) => env.value === environment);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 px-3"
        >
          <div className={cn("h-2 w-2 rounded-full", currentEnv?.color)} />
          {currentEnv?.label}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {environments.map((env) => (
              <CommandItem
                key={env.value}
                value={env.value}
                onSelect={() => {
                  onEnvironmentChange(env.value as Environment);
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={cn("h-2 w-2 rounded-full", env.color)} />
                {env.label}
                {environment === env.value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EnvSwitcher;
