import React from 'react'

const Sidebarcomponent = ({ step, p, isActive }: {step: number, p: string, isActive: boolean}) => {
  const circleClasses = isActive
    ? "bg-[#bfe2fd] text-[#02295a] border-transparent"
    : "bg-transparent text-[#bfe2fd] border-[#bfe2fd]";

  return (
    <div className="flex flex-row items-center gap-4">
        <h1
        className={"circules w-9 h-9 flex items-center justify-center rounded-full font-medium cursor-pointer border " +
          circleClasses
        }
      >
        {step}
      </h1>
      <div className="leading-5">
        <p className="text text-[14px] lg:flex md:hidden sm:hidden text-[#9699ab] uppercase">{`step${step}`}</p>
        <h3 className="text text-[16px] lg:flex md:hidden sm:hidden text-[#ffffff] uppercase font-normal">
          {p}
        </h3>
      </div>
    </div>
  );
};


export default Sidebarcomponent