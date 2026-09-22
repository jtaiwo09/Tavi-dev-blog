import { getCurrentUser } from "@/lib/actions/users";
import MobileNavLinks from "./navigation/mobile-nav-links";
import { Brand } from "./brand";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <Brand />
      <MobileNavLinks user={user} />
    </>
  );
};

export default Navbar;
