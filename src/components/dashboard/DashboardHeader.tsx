import { Bell, User, Settings, Server, Flag, Home, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnvSwitcher from "./EnvSwitcher";
import { Environment } from "@/types";
import { useNavigate, NavLink } from "react-router-dom";
import { TokenManager } from "@/utils/auth";
import { UserData } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface DashboardHeaderProps {
  environment: Environment;
  onMenuToggle?: () => void;
}

const DashboardHeader = ({ environment, onMenuToggle }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const userData: UserData | null = TokenManager.getUserData();

  const handleLogout = () => {
    TokenManager.clearTokens();
    navigate('/login');
  };

  return (
    <header className="border-b bg-card z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo + Environment */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Feature Guardian</h1>
          <EnvSwitcher environment={environment} />
        </div>

        {/* Right side - Navigation + User Menu */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <NavLink 
                to="/microservices" 
                className={({ isActive }) => 
                  `flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <Server className="h-4 w-4" />
                Microservices
              </NavLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <NavLink 
                to="/feature-flags" 
                className={({ isActive }) => 
                  `flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <Flag className="h-4 w-4" />
                Feature Flags
              </NavLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
            >
              <NavLink
                to="/release-management"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-2 ${isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <Package className="h-4 w-4" />
                Release Management
              </NavLink>
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full overflow-hidden">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-primary">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name || 'User'}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Show the initials when the image fails to load
                        const initials = target.nextElementSibling as HTMLElement;
                        if (initials) initials.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 items-center justify-center bg-primary text-primary-foreground font-medium text-sm"
                    style={{ display: userData?.avatar ? 'none' : 'flex' }}
                  >
                    {userData?.name 
                      ? userData.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .substring(0, 2)
                      : 'U'}
                  </div>
                </div>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.name || 'User'}
                    </p>
                    {userData?.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
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
      </div>
    </header>
  );
};

export default DashboardHeader;