import * as React from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import LogoSVG from "./LogoSVG";
import { Button } from "./ui/button";
<<<<<<< HEAD
import { Link } from "react-router";
import { BsSoundwave } from "react-icons/bs";
=======
import { Link, useLocation } from "react-router";
>>>>>>> working

// This is sample data.
// const data = {
//   user: {
//     name: "Supriyo",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Conversations",
//       items: [],
//     },
//   ],
// };

export function AppSidebar({
  data,
<<<<<<< HEAD
  startNewConv,
=======
  startConversation,
>>>>>>> working
  ...props
}: {
  data: {
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    navMain: Array<{
      title: string;
      items:
        | Array<{
            title: string;
            url: string;
            isActive?: boolean;
            id: string;
          }>
        | undefined;
    }>;
  };
<<<<<<< HEAD
  startNewConv: () => void;
=======
  startConversation: () => void;
>>>>>>> working
} & React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
<<<<<<< HEAD
              <a href="#">
                <div className="bg-sidebar-accent text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <GalleryVerticalEnd className="size-4" /> */}
=======
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
>>>>>>> working
                  <LogoSVG classname="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Talk2Me</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button
            variant={"cta"}
            className="border-2 border-white/20"
<<<<<<< HEAD
            onClick={startNewConv}
          >
            <BsSoundwave />
=======
            onClick={startConversation}
          >
>>>>>>> working
            Start new Chat
          </Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-medium text-muted-foreground">
                      {item.title}
                      <ChevronUp className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item, idx) => {
                          const isActive =
                            location.pathname === `/c/${item.id}`;

                          return (
                            <SidebarMenuSubItem key={item.title + item.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                className={`${
                                  isActive
                                    ? "bg-gradient-to-r from-accent/60 to-accent/10 py-4 border border-accent"
                                    : ""
                                }`}
                              >
                                <Link key={item.id} to={`/c/${item.id}`}>
                                  {idx + 1 + ". " + item.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
