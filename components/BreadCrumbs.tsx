'use client'

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  

const BreadCrumbs = () => {
    const path = usePathname()
    const currentPath = path.split('/')
    const currentPathName = currentPath[currentPath.length-1]
    const basePathName = currentPath[currentPath.length-2]
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {basePathName ? 
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${basePathName ?? ""}`}>{basePathName ?? ""}</BreadcrumbLink>
                </BreadcrumbItem>
                : ""}
                {basePathName ? <BreadcrumbSeparator /> : ""}
                <BreadcrumbItem>
                    <BreadcrumbPage>{currentPathName ?? ""}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumbs