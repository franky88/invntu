import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu"
import Link from "next/link"

const Header = () => {
  return (
    <NavigationMenu className="py-5 px-20">
        <NavigationMenuList className="flex gap-1">
            <NavigationMenuItem>
                <Link href='/' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboards</NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href='/users' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Users</NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href='/items' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Items</NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Header