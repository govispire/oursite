
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, CalendarDays, BookOpen, FileCheck, 
  FileText, Lightbulb, BarChart2, Heart, FileQuestion,
  HelpCircle, Upload, Eye, CheckCircle, Users, Bell,
  PieChart, CreditCard, Settings, UserCheck, MessageSquare,
  Target, Clock, TrendingUp
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active, collapsed }) => {
  return (
    <li className="mb-2">
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-gray-100",
          active ? "bg-brand-blue/10 text-brand-blue font-semibold" : "text-gray-700 font-medium"
        )}
        title={label}
      >
        {icon}
        {!collapsed && <span className="font-semibold">{label}</span>}
      </Link>
    </li>
  );
};

interface SidebarProps {
  role: 'student' | 'admin' | 'instructor' | 'employee' | 'super-admin' | 'owner' | 'mentor';
  basePath: string;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role, basePath, collapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current path matches or is a sub-path of the nav item
  const isActive = (path: string) => {
    if (path === `${basePath}/mentorship`) {
      // For mentorship, check if current path starts with mentorship
      return location.pathname.startsWith(`${basePath}/mentorship`);
    }
    return location.pathname === path;
  };
  
  // Define navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <UserCheck size={18} />, label: 'Mentorship', to: `${basePath}/mentorship/dashboard` },
          { icon: <BookOpen size={18} />, label: 'Courses', to: `${basePath}/courses` },
          { icon: <TrendingUp size={18} />, label: 'Zero to Hero', to: `${basePath}/zero-to-hero` },
          { icon: <FileCheck size={18} />, label: 'Tests', to: `${basePath}/tests` },
          { icon: <FileText size={18} />, label: 'Current Affairs', to: `${basePath}/current-affairs` },
          { icon: <Lightbulb size={18} />, label: 'Speed Drills', to: `${basePath}/speed-drills` },
          { icon: <BarChart2 size={18} />, label: 'Performance Analytics', to: `${basePath}/performance` },
          { icon: <Bell size={18} />, label: 'Exam Notifications', to: `${basePath}/exam-notifications` },
          { icon: <Heart size={18} />, label: 'Self-Care', to: `${basePath}/self-care` },
          { icon: <FileText size={18} />, label: 'PDF Courses', to: `${basePath}/pdf-courses` },
          { icon: <FileQuestion size={18} />, label: 'Doubt Forum', to: `${basePath}/doubt-forum` },
          { icon: <HelpCircle size={18} />, label: 'FAQ', to: `${basePath}/faq` },
        ];
      case 'mentor':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <Users size={18} />, label: 'My Students', to: `${basePath}/students` },
          { icon: <Target size={18} />, label: 'Assign Tasks', to: `${basePath}/assign-tasks` },
          { icon: <TrendingUp size={18} />, label: 'Progress Tracking', to: `${basePath}/progress` },
          { icon: <CalendarDays size={18} />, label: 'Sessions', to: `${basePath}/sessions` },
          { icon: <MessageSquare size={18} />, label: 'Messages', to: `${basePath}/messages` },
          { icon: <BarChart2 size={18} />, label: 'Analytics', to: `${basePath}/analytics` },
          { icon: <Clock size={18} />, label: 'Schedule', to: `${basePath}/schedule` },
        ];
      case 'employee':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <Upload size={18} />, label: 'Upload Questions & Tests', to: `${basePath}/upload-questions` },
          { icon: <Upload size={18} />, label: 'Upload Study Materials', to: `${basePath}/upload-materials` },
          { icon: <Eye size={18} />, label: 'Preview Tests', to: `${basePath}/preview-tests` },
          { icon: <CheckCircle size={18} />, label: 'Approvals', to: `${basePath}/approvals` },
        ];
      case 'admin':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <Users size={18} />, label: 'Manage Employees', to: `${basePath}/manage-employees` },
          { icon: <Users size={18} />, label: 'Manage Students', to: `${basePath}/manage-students` },
          { icon: <FileCheck size={18} />, label: 'Create/Edit Tests', to: `${basePath}/edit-tests` },
          { icon: <Upload size={18} />, label: 'Upload Courses & PDFs', to: `${basePath}/upload-courses` },
          { icon: <Bell size={18} />, label: 'Push Notifications', to: `${basePath}/notifications` },
        ];
      case 'super-admin':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <Users size={18} />, label: 'Create Admins', to: `${basePath}/create-admins` },
          { icon: <Users size={18} />, label: 'Manage All Users', to: `${basePath}/manage-users` },
          { icon: <CreditCard size={18} />, label: 'Payment/Plans', to: `${basePath}/payment-plans` },
          { icon: <BarChart2 size={18} />, label: 'View Analytics', to: `${basePath}/analytics` },
        ];
      case 'owner':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: `${basePath}/dashboard` },
          { icon: <Users size={18} />, label: 'Manage Users', to: `${basePath}/manage-users` },
          { icon: <FileText size={18} />, label: 'Content Management', to: `${basePath}/content-management` },
          { icon: <PieChart size={18} />, label: 'Business Analytics', to: `${basePath}/business-analytics` },
          { icon: <CalendarDays size={18} />, label: 'Calendar', to: `${basePath}/calendar` },
          { icon: <Bell size={18} />, label: 'Notifications', to: `${basePath}/notifications` },
          { icon: <CreditCard size={18} />, label: 'Payments & Plans', to: `${basePath}/payments-plans` },
          { icon: <Settings size={18} />, label: 'Settings', to: `${basePath}/settings` },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className={`h-full bg-white border-r flex flex-col ${collapsed ? 'items-center' : ''}`}>
      <div className={`p-4 border-b flex ${collapsed ? 'justify-center' : 'items-center gap-2'}`}>
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">P</div>
        {!collapsed && <span className="text-lg font-bold">PrepSmart</span>}
      </div>
      
      {collapsed && (
        <div className="py-4 border-b flex justify-center">
          <Avatar>
            <AvatarFallback className="bg-brand-blue text-white">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className={`space-y-1 ${collapsed ? 'items-center' : ''}`}>
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={isActive(item.to)}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
