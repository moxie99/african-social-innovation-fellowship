'use client'

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  ChevronDownIcon,
  type LucideIcon,
  CheckCircleIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useModuleProgress } from '@/context/ModuleProgressContext'
import { Module } from '@/types/type'
import {toast} from "sonner"
interface Document {
  name: string
  url: string
  icon: LucideIcon
  modules?: Module[]
}

export function NavDocuments({ items }: { items: Document[] }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const { completedModules, currentModule, canAccessModule } =
    useModuleProgress()

  // Function to get module color based on completion status
  const getModuleColor = (moduleId: string) => {
    const normalizedId = moduleId.toLowerCase().replace(/\s+/g, '-')

    if (completedModules.includes(normalizedId)) {
      return 'text-green-500'
    }

    if (normalizedId === currentModule) {
      return 'text-blue-500'
    }

    return 'text-gray-400'
  }
  // const handleModuleClick = (
  //   e: React.MouseEvent,
  //   moduleId: string,
  //   url: string
  // ) => {
  //   const normalizedId = moduleId.toLowerCase().replace(/\s+/g, '-')

  //   if (!canAccessModule(normalizedId)) {
  //     e.preventDefault()
  //     return
  //   }

  //   router.push(url)
  // }
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Courses</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.name}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() =>
                  setExpandedCourse(
                    expandedCourse === item.name ? null : item.name
                  )
                }
              >
                <div className='flex items-center w-full'>
                  <item.icon />
                  <span>{item.name}</span>
                  {item.modules && (
                    <ChevronDownIcon
                      className={`ml-auto transition-transform ${
                        expandedCourse === item.name
                          ? 'transform rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </div>
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
                        router.push(
                          '/dashboard/courses/startup-founders-basics'
                        )
                      }
                      variant={'ghost'}
                    >
                      Course
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    <Button
                      onClick={() =>
                        router.push('/dashboard/courses/questions')
                      }
                      variant={'ghost'}
                    >
                      Assess.
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            {/* Modules submenu */}
            {item.modules && expandedCourse === item.name && (
              <div className='pl-6'>
                {item.modules.map((module) => {
                  const moduleId =
                    typeof module.id === 'string'
                      ? module?.id?.toLowerCase().replace(/\s+/g, '-')
                      : `module-${module.id}`

                  const isCompleted = completedModules.includes(moduleId)
                  const isCurrent = moduleId === currentModule
                  const isAccessible = canAccessModule(moduleId)

                  return (
                    <TooltipProvider key={moduleId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              className={`relative ${getModuleColor(
                                moduleId
                              )} ${
                                !isAccessible
                                  ? 'cursor-not-allowed opacity-50'
                                  : ''
                              }`}
                            >
                              <div
                                // onClick={(e) =>
                                //   handleModuleClick(e, moduleId, module.url)
                                // }
                                onClick={() => toast.error("Course not available yet")}
                                className='flex items-center gap-2'
                              >
                                <module.icon className='h-4 w-4' />
                                <span className='text-sm'>{module.id}</span>
                                {isCompleted && (
                                  <CheckCircleIcon className='h-4 w-4 text-green-500 ml-auto' />
                                )}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isAccessible
                            ? 'Complete previous modules first'
                            : isCompleted
                            ? 'Module completed'
                            : isCurrent
                            ? 'Current module'
                            : 'Module available'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            )}
          </div>
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
