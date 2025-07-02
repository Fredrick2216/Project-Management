import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  BarChart3, 
  LogOut,
  Brain,
  Menu,
  X,
  Bot
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { NavigationDropdown } from "./NavigationDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Automation', href: '/automation', icon: Bot },
  ];

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen innovative-bg">
      {/* Mobile Menu Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-72' : 'w-64'}
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0
        dark-glass-card shadow-2xl
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between mobile-padding py-4 sm:py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary animate-pulse-slow" />
              <span className="responsive-text-lg font-bold ai-gradient-text">TaskAI</span>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
                className="lg:hidden touch-button"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 mobile-padding py-4 sm:py-6 space-y-1 sm:space-y-2 smooth-scroll overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-3 sm:py-2 rounded-lg responsive-text-sm font-medium transition-all touch-button ${
                    isActive
                      ? 'ai-gradient text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mobile-padding py-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="ai-gradient text-white responsive-text-xs">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="responsive-text-sm font-medium text-slate-200 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 touch-button"
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isMobile ? 'lg:pl-64' : 'lg:pl-64'}`}>
        {/* Top Bar */}
        <header className="dark-glass-card border-b border-slate-700/50 mobile-padding py-3 sm:py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden touch-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              {/* Page Title */}
              <div className="flex-1 min-w-0">
                <h1 className="responsive-text-xl font-bold text-slate-100 truncate">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
              {/* Navigation Dropdown - Hidden on very small screens */}
              <div className="hidden xs:block">
                <NavigationDropdown />
              </div>
              
              {/* Notification Center */}
              <NotificationCenter />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mobile-padding py-4 sm:py-6 smooth-scroll">
          <div className="max-w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
