'use client'

import * as React from 'react'
import {
  ArrowUpCircleIcon,
  CameraIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { NavDocuments } from '@/components/nav-documents'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { modules } from '@/data/modules'
import { NavUser } from './nav-user'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    // {
    //   title: 'Dashboard',
    //   url: '#',
    //   icon: LayoutDashboardIcon,
    // },
    // {
    //   title: 'Lifecycle',
    //   url: '#',
    //   icon: ListIcon,
    // },
    // {
    //   title: 'Analytics',
    //   url: '#',
    //   icon: BarChartIcon,
    // },
    // {
    //   title: 'Projects',
    //   url: '#',
    //   icon: FolderIcon,
    // },
    // {
    //   title: 'Team',
    //   url: '#',
    //   icon: UsersIcon,
    // },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: CameraIcon,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: FileTextIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: FileCodeIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircleIcon,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: 'Startup Founders Basics',
      url: '/dashboard/courses/startup-founders-basics',
      icon: DatabaseIcon,
      modules: modules,
    },
    // {
    //   name: 'Reports',
    //   url: '#',
    //   icon: ClipboardListIcon,
    // },
    // {
    //   name: 'Word Assistant',
    //   url: '#',
    //   icon: FileIcon,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const sidebarUser = user
    ? {
        name: user.fullName || user.firstName || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        avatar: user.imageUrl || '',
      }
    : {
        name: 'Loading...',
        email: '',
        avatar: '',
      }
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <a href='#'>
                <ArrowUpCircleIcon className='h-5 w-5' />
                <span className='text-base font-semibold'>
                  African Social Innovation Fellowship.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
