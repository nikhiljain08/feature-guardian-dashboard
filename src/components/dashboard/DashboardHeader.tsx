
import { Bell, User, Settings, Server, Flag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnvSwitcher from "./EnvSwitcher";
import { Environment } from "@/types";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
}

const DashboardHeader = ({ environment, onEnvironmentChange }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="border-b bg-card z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Feature Guardian</h1>
          <EnvSwitcher
            environment={environment}
            onEnvironmentChange={onEnvironmentChange}
          />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/microservices')}
          >
            <Server className="h-4 w-4" />
            Microservices
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/feature-flags')}
          >
            <Flag className="h-4 w-4" />
            Feature Flags
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
