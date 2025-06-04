export interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  isActive: boolean
}

// This will be replaced with data from the admin panel
export const defaultNavigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    order: 1,
    isActive: true
  },
  {
    id: "donate",
    label: "Donate",
    href: "/donations",
    order: 2,
    isActive: true
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    href: "/ecommerce",
    order: 3,
    isActive: true
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    order: 4,
    isActive: true
  },
  {
    id: "about",
    label: "About Us",
    href: "#about",
    order: 5,
    isActive: true
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    order: 6,
    isActive: true
  }
]

// Function to get sorted navigation items
export function getNavigationItems(): NavigationItem[] {
  return [...defaultNavigationItems]
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order)
} 