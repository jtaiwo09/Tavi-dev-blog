import { getCurrentUser } from "@/lib/actions/users";
import { getSession } from "@/lib/session";

import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";
import Navbar from "./navbar";

const NavbarContainer = async () => {
  return (
    <div className="relative">
      <DesktopNavbar>
        <Navbar />
      </DesktopNavbar>

      <MobileNavbar>
        <Navbar />
      </MobileNavbar>
    </div>
  );
};

export default NavbarContainer;
