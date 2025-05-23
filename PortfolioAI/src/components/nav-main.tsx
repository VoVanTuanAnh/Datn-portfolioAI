"use client"



import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Frame,
  Image,
  Images,
  Layers,
  Settings2,
  SquareTerminal,
} from "lucide-react"

const navItems = 
  [
   {
    title: "Dashboard",
    url: '/dashboard',
    icon: SquareTerminal
   },
   {
    title: "My Portfolio",
    url: '/portfolio',
    icon: Image
   },
   {
    title: "Generate Image",
    url: '/generate_image',
    icon: Image
   },
   {
    title: "My Models",
    url: '/models',
    icon: Frame
   },
   {
    title: "Train Model",
    url: '/model-training',
    icon: Layers
   },
   {
    title: "My Images",
    url: '/gallery',
    icon: Images
   },
   {
    title: "Settings",
    url: '/account-settings',
    icon: Settings2
   }
  ]

export function NavMain() {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
            <Link key={item.title} href={item.url} className={cn("rounded-none",
              pathname === item.url ? 'text-primary bg-primary/5' : 'text-muted-foreground'
            )}>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
