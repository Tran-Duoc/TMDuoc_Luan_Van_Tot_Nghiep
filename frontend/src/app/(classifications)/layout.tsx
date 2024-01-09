import React from "react";
import Aside from "./_components/Aside";

const ClassificationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-16 flex h-[calc(100vh-4rem)]  gap-x-2">
      <Aside />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ClassificationLayout;
