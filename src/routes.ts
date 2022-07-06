import type { IconType } from "react-icons";
import { IoLogoGithub } from "react-icons/io5";
import { IoSwapVertical } from "react-icons/io5";
import { CgDropOpacity } from "react-icons/cg";
import { TbShoppingCartPlus } from "react-icons/tb";

interface Route {
  label: string;
  href: string;
  isExternal: boolean;
  icon?: IconType;
}

export const homeRoutes: Route[] = [
  {
    label: "Documentation",
    href: "https://docs.axoswap.io",
    isExternal: true,
  },
  {
    label: "Community",
    href: "#",
    isExternal: true,
  },
  {
    label: "Github",
    href: "https://github.com/Axoswap-Polygon",
    icon: IoLogoGithub,
    isExternal: true,
  },
];

export const appRoutes: Route[] = [
  {
    href: "/app/swap",
    label: "Swap",
    icon: IoSwapVertical,
    isExternal: false,
  },
  {
    href: "/app/pool",
    label: "Pool",
    icon: CgDropOpacity,
    isExternal: false,
  },
  {
    href: "/app/stake",
    label: "Stake",
    icon: TbShoppingCartPlus,
    isExternal: false,
  },
];