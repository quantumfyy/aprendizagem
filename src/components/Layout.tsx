import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Settings, BarChart3, BookOpen, MessageSquare, Menu, X, Edit, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
// Altere a importação do auth
import { auth } from '@/services/auth';
import { toast } from 'react-toastify';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Perfil', path: '/profile', icon: User },
  { title: 'Progresso', path: '/progress', icon: BarChart3 },
  { title: 'Questões', path: '/quiz', icon: BookOpen },
  { title: 'Chat', path: '/chat', icon: MessageSquare },
  { title: 'Redação', path: '/writing', icon: Edit },
  { title: 'Configurações', path: '/settings', icon: Settings }
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-sm transition-transform duration-300 ease-in-out transform lg:relative lg:translate-x-0",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
          "glass-panel lg:glass-panel"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              TutorIA
            </h1>
            {isMobile && (
              <button onClick={toggleSidebar} className="lg:hidden">
                <X size={20} />
              </button>
            )}
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "sidebar-item group",
                    isActive && "active"
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full animate-pulse" />
                  )}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="sidebar-item group w-full"
            >
              <LogOut size={20} className="text-muted-foreground group-hover:text-foreground" />
              <span>Sair</span>
            </button>
          </nav>
          <div className="p-4 border-t border-border text-xs text-muted-foreground">
            <p>© 2024 TutorIA</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="p-4 lg:p-8">
          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={toggleSidebar}
              className="mb-4 p-2 rounded-md hover:bg-accent"
            >
              <Menu size={24} />
            </button>
          )}
          
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
