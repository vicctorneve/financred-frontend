
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  console.log(user)

  // Define menu items based on user role
  const getMenuItems = () => {
    const items = [
      {
        title: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: '/dashboard',
        roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'],
      },
    ];

    // Admin and cliente can access clients, loans, payments and
    if (['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(user?.role || '')) {
      items.push(
        {
          title: 'Clientes',
          icon: <Users className="h-5 w-5" />,
          path: '/clientes',
          roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'],
        },
        {
          title: 'Empréstimos',
          icon: <FileText className="h-5 w-5" />,
          path: '/emprestimos',
          roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'],
        },
        {
          title: 'Pagamentos',
          icon: <CreditCard className="h-5 w-5" />,
          path: '/pagamentos',
          roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'],
        }
      );
    }


    // Admin only settings
    if (user?.role === 'ROLE_ADMIN') {
      items.push({
        title: 'Configuração',
        icon: <Settings className="h-5 w-5" />,
        path: '/settings',
        roles: ['ADMIN'],
      });
    }

    return items;
  };

  const menuItems = getMenuItems();
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '??';

  const handleLogout = () =>{
    logout()
  }

  return (
    <div
      className={cn(
        'relative h-full bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 mb-6">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-xl font-heading">Finly ERP</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'p-0 h-6 w-6 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'mx-auto'
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            if (user.role == 'ROLE_CLIENTE' && item.title == 'Clientes') return
            if (!item.roles.includes(user?.role || '')) return null; 
             
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md transition-colors',
                    location.pathname === item.path
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>

            </div>
          )}
        </div>
        <Link
        to={"/login"}>
          <Button
            variant="ghost"
            className={cn(
              'mt-2 flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full',
              collapsed ? 'px-0' : 'px-3'
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
};
