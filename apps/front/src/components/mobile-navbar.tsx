"use client";

import type { PropsWithChildren } from "react";
import { Menu } from "lucide-react";

import SideBar from "./ui/SideBar";

const MobileNavbar = ({ children }: PropsWithChildren) => {
  return (
    <div className="md:hidden">
      <SideBar triggerIcon={<Menu className="size-4.5" strokeWidth={2} />}>
        {children}
      </SideBar>
    </div>
  );
};

export default MobileNavbar;
