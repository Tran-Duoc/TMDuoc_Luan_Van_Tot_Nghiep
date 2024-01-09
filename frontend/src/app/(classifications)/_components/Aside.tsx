"use client";

import { ASIDE_ITEMS } from "@/constants/aside-item";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Aside = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="w-full max-w-[210px] border-r">
      <div className="mt-5 flex flex-col gap-y-2 px-2">
        {ASIDE_ITEMS.map((item, index) => (
          <Link
            href={item.pathname}
            key={index}
            className={cn(
              "flex items-center justify-start gap-x-2 rounded-lg px-2 py-4 transition duration-200 hover:bg-blue-600/40 ",
              {
                "bg-[#3a72ec] text-white": item.pathname === pathname,
              },
            )}
            title={item.name}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Aside;
