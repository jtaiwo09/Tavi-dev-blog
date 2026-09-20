import Link from "next/link";

import { getCurrentUser } from "@/lib/actions/users";
import { getSession } from "@/lib/session";
import MobileNavLinks from "./navigation/mobile-nav-links";
import { Brand } from "./brand";

const Navbar = async () => {
  const session = await getSession();
  const user = session ? await getCurrentUser() : null;

  return (
    <>
      <Brand />
      <MobileNavLinks user={user} />
    </>
  );
};

export default Navbar;
