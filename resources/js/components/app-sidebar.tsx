import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
  LayoutGrid, 
  BookOpen, 
  PlusCircle, 
  Building2,   // for Departments
  GraduationCap, // for Courses
  Folder        // for Repository
} from "lucide-react";
import AppLogo from './app-logo';

// ✅ Main navigation items (top section)
const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Articles',
    href: '/articles',
    icon: BookOpen,
    children: [
      { title: 'Create Article', href: '/articles/create', icon: PlusCircle },
    ],
  },
  {
    title: 'Departments',
    href: '/departments',
    icon: Building2,
    children: [
      { title: 'Create Department', href: '/departments/create', icon: PlusCircle },
    ],
  },
  {
    title: 'Courses',
    href: '/courses', // fixed typo
    icon: GraduationCap,
    children: [
      { title: 'Create Course', href: '/courses/create', icon: PlusCircle },
    ],
  },
  {
    title: 'Ebooks',
    href: '/ebooks', // fixed typo
    icon: BookOpen,
    children: [
      { title: 'Create Course', href: '/ebooks/create', icon: PlusCircle },
    ],
  },
  {
    title: 'Thesis',
    href: '/thesis', // fixed typo
    icon: BookOpen,
    children: [
      { title: 'Create Course', href: '/thesis/create', icon: PlusCircle },
    ],
  },
  // E-Publishcations
  // {
  //   title: 'E-Publications',
  //   href: '/e-publications', // fixed typo
  //   icon: BookOpen,
  //   children: [
  //     { title: 'Create E-Publication', href: '/e-publications/create', icon: PlusCircle },
  //   ],
  // },
  // // Journals
  // {
  //   title: 'Journals',
  //   href: '/journals', // fixed typo
  //   icon: BookOpen,
  //   children: [
  //     { title: 'Create Journal', href: '/journals/create', icon: PlusCircle },
  //   ],
  // },
  // Videos
  // {
  //   title: 'Videos',
  //   href: '/videos', // fixed typo
  //   icon: BookOpen,
  //   children: [
  //     { title: 'Create Video', href: '/videos/create', icon: PlusCircle },
  //   ],
  // },
];

// ✅ Footer navigation items (bottom section)
const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
    external: true,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
    external: true,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header with Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch={true} aria-label="Go to Dashboard">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Items */}
      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* Footer with links + user info */}
      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
