'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from "@/components/admin/sidebar-logout"

interface SidebarItem {
  id: string
  label: string
  icon: string
  href: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'admin',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    href: '/admin'
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'fas fa-users',
    href: '/admin/users'
  },
  {
    id: 'jobs',
    label: 'Jobs Management',
    icon: 'fas fa-briefcase',
    href: '/admin/jobs',
    children: [
      { id: 'all-jobs', label: 'All Jobs', icon: 'fas fa-list', href: '/admin/jobs' },
      { id: 'job-categories', label: 'Job Categories', icon: 'fas fa-tags', href: '/admin/jobs/categories' },
      { id: 'new-job', label: 'New Job', icon: 'fas fa-plus', href: '/admin/jobs/new' }
    ]
  },
  {
    id: 'blog',
    label: 'Blog Management',
    icon: 'fas fa-blog',
    href: '/admin/blog',
    children: [
      { id: 'posts', label: 'All Posts', icon: 'fas fa-file-alt', href: '/admin/blog/posts' },
      { id: 'new-post', label: 'New Post', icon: 'fas fa-plus', href: '/admin/blog/new' },
      { id: 'categories', label: 'Categories', icon: 'fas fa-tags', href: '/admin/blog/categories' }
    ]
  },
  {
    id: 'content',
    label: 'Website Content',
    icon: 'fas fa-globe',
    href: '/admin/content',
    children: [
      { id: 'homepage', label: 'Homepage', icon: 'fas fa-home', href: '/admin/content/homepage' },
      { id: 'services', label: 'Services', icon: 'fas fa-cogs', href: '/admin/content/services' },
      { id: 'about', label: 'About Page', icon: 'fas fa-info-circle', href: '/admin/content/about' },
      { id: 'testimonials', label: 'Testimonials', icon: 'fas fa-quote-right', href: '/admin/content/testimonials' }
    ]
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    icon: 'fas fa-envelope',
    href: '/admin/newsletter'
  },
  {
    id: 'form-responses',
    label: 'Form Responses',
    icon: 'fas fa-list-alt',
    href: '/admin/form-responses'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'fas fa-chart-bar',
    href: '/admin/analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'fas fa-cog',
    href: '/admin/settings'
  }
]

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => pathname === href
  const isParentActive = (item: SidebarItem) => 
    item.children?.some(child => pathname === child.href) || pathname === item.href

  const renderSidebarItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)
    const parentActive = isParentActive(item)

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
            active || parentActive
              ? 'bg-scio-blue text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          } ${depth > 0 ? 'ml-4 text-sm' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            }
          }}
        >
          <Link href={hasChildren ? '#' : item.href} className="flex items-center flex-1">
            <i className={`${item.icon} w-5 text-center mr-3`}></i>
            <span className="font-medium">{item.label}</span>
          </Link>
          {hasChildren && (
            <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}></i>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="p-6 flex-1">
        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>
      </div>
      <div className="p-6 border-t border-gray-100">
        <LogoutButton />
      </div>
    </div>
  )
}

