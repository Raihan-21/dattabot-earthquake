import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const MobileSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <div className="w-full  absolute top-2 flex justify-end px-4">
      <Button onClick={onOpen}>Menu</Button>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={"primary"} color={"white"}>
          <div className="p-4">
            <p className="pl-4 text-xl font-bold">
              Dattabot Earthquake Monitoring
            </p>
          </div>
          <div className="flex flex-col">
            <Link
              href={"/"}
              className={`p-4 ${
                router.pathname === "/" ? "bg-secondary font-bold" : ""
              }`}
            >
              Home
            </Link>{" "}
            <Link
              href={"/occured"}
              className={`p-4 ${
                router.pathname === "/occured" ? "bg-secondary font-bold" : ""
              }`}
            >
              Total occured
            </Link>
            <Link
              href={"/alert"}
              className={`p-4 ${
                router.pathname === "/alert" ? "bg-secondary font-bold" : ""
              }`}
            >
              Alert Level
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileSidebar;
