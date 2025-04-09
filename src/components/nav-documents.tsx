'use client'

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  type LucideIcon,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Courses</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className='rounded-sm data-[state=open]:bg-accent'
                >
                  <MoreHorizontalIcon />
                  <span className='sr-only'>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-24 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <FolderIcon />
                  <Button
                    onClick={() =>
                      router.push('/dashboard/courses/startup-founders-basics')
                    }
                    variant={'ghost'}
                  >
                    Course
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  <Button
                    onClick={() => router.push('/dashboard/courses/questions')}
                    variant={'ghost'}
                  >
                    Assess.
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className='text-sidebar-foreground/70'>
            <MoreHorizontalIcon className='text-sidebar-foreground/70' />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
