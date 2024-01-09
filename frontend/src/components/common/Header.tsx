import React from "react";
import Logo from "./Logo";
import { ModeToggle } from "./ToggleMode";

const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0">
      <div className="flex h-16 items-center justify-between border-b bg-slate-100 px-4 py-6 shadow-sm dark:bg-[#020817] ">
        <Logo />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
