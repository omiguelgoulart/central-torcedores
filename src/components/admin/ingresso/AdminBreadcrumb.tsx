"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type AdminBreadcrumbItem = {
  label: string
  href?: string
}

type AdminBreadcrumbProps = {
  items: AdminBreadcrumbItem[]
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  if (!items.length) return null

  const lastIndex = items.length - 1

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === lastIndex

          return (
            <BreadcrumbItem key={item.label}>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}

              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
