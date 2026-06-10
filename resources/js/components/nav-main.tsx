import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const url = page.url ?? "";

  // track open state for collapsible parents
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const it of items) {
      if (it.children && it.href) {
        const matchParent = url === it.href || url.startsWith(`${it.href}/`);
        const matchChild = it.children.some((c) => c.href && (url === c.href || url.startsWith(`${c.href}/`)));
        initial[it.href] = matchParent || matchChild;
      }
    }
    return initial;
  });

  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const isActive = (href?: string) => !!href && (url === href || url.startsWith(`${href}/`));

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const key = item.href ?? item.title;
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;

          // if no children — simple menu item
          if (!hasChildren) {
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.title }}
                >
                  <Link href={item.href ?? "#"} prefetch={true} aria-label={item.title}>
                    {item.icon && <item.icon aria-hidden="true" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // parent with children: render parent row + nested children
          const expanded = !!open[item.href ?? key];

          return (
            <div key={key}>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 w-full">
                  {/* Parent link (left) */}
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href) || item.children!.some((c) => isActive(c.href))}
                    tooltip={{ children: item.title }}
                  >
                    <Link href={item.href ?? "#"} prefetch={true} aria-label={item.title} className="flex items-center gap-2 flex-1">
                      {item.icon && <item.icon aria-hidden="true" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {/* Toggle caret (right) */}
                  <button
                    type="button"
                    aria-label={expanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
                    onClick={() => toggle(item.href ?? key)}
                    className="p-2 rounded hover:bg-muted/50 transition-transform"
                  >
                    <ChevronDown
                      className={[
                        "h-4 w-4 transition-transform",
                        expanded ? "rotate-180" : "rotate-0",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </SidebarMenuItem>

              {/* Children list (indented) */}
              {expanded &&
                item.children!.map((child) => (
                  <SidebarMenuItem key={child.href ?? child.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(child.href)}
                      tooltip={{ children: child.title }}
                    >
                      {child.external ? (
                        <a
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-6 block w-full"
                        >
                          {child.icon && <child.icon aria-hidden="true" />}
                          <span>{child.title}</span>
                        </a>
                      ) : (
                        <Link href={child.href ?? "#"} prefetch={true} className="pl-6 block w-full" aria-label={child.title}>
                          {child.icon && <child.icon aria-hidden="true" />}
                          <span>{child.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </div>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
