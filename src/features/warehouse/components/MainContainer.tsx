import type React from "react";

const MainContainer = ({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-between px-8 py-6 items-center border-b">
        <span className="text-2xl/[1.2] font-bold tracking-tight">
          Warehouse
        </span>
      </div>
      <div className="w-full flex flex-1 overflow-hidden">
        {sidebar}
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
