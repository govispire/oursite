
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  HelpCircle,
  Heart,
  Download,
  Zap,
  Newspaper,
  Bell,
  TrendingUpDown
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    url: '/student/courses',
    icon: BookOpen,
  },
  {
    title: 'Tests',
    url: '/student/tests',
    icon: FileText,
  },
  {
    title: 'Calendar',
    url: '/student/calendar',
    icon: Calendar,
  },
  {
    title: 'Performance',
    url: '/student/performance',
    icon: TrendingUp,
  },
  {
    title: 'Zero to Hero',
    url: '/student/zero-to-hero',
    icon: TrendingUpDown,
  },
  {
    title: 'Mentorship',
    url: '/student/mentorship',
    icon: Users,
  },
  {
    title: 'Current Affairs',
    url: '/student/current-affairs',
    icon: Newspaper,
  },
  {
    title: 'Speed Drills',
    url: '/student/speed-drills',
    icon: Zap,
  },
  {
    title: 'Exam Notifications',
    url: '/student/exam-notifications',
    icon: Bell,
  },
  {
    title: 'PDF Courses',
    url: '/student/pdf-courses',
    icon: Download,
  },
  {
    title: 'Doubt Forum',
    url: '/student/doubt-forum',
    icon: MessageSquare,
  },
  {
    title: 'Self Care',
    url: '/student/self-care',
    icon: Heart,
  },
  {
    title: 'FAQ',
    url: '/student/faq',
    icon: HelpCircle,
  },
];

export function StudentSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-gray-900">Student Portal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-gray-500">
          © 2025 Student Portal
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
