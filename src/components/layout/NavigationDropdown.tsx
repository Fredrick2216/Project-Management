
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  BarChart3,
  Settings,
  Bot
} from "lucide-react";

export const NavigationDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Automation', href: '/automation', icon: Bot },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const currentPage = navigationItems.find(item => item.href === location.pathname);

  const handleNavigate = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all min-w-[140px] justify-between"
        >
          <div className="flex items-center gap-2">
            {currentPage?.icon && <currentPage.icon className="h-4 w-4" />}
            <span className="hidden sm:inline">{currentPage?.name || 'Navigate'}</span>
            <span className="sm:hidden">Menu</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white/95 backdrop-blur-lg border-white/20 shadow-lg"
        align="start"
      >
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <DropdownMenuItem
              key={item.name}
              onClick={() => handleNavigate(item.href)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
