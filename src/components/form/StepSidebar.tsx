import Sidebarcomponent from './Sidebarcomponent';

const StepSidebar = ({ currentStep, sideData }: {currentStep: number, sideData: string[]}) => {
  return (
    <div className="sidebar flex md:flex-row sm:flex-row lg:flex-col md:justify-center sm:justify-center lg:justify-start gap-7 md:p-3 sm:p-3 lg:p-7 pt-10 lg:h-[568] lg:w-[310] lg:bg-[url('/bg-sidebar-desktop.svg')] object-cover bg-no-repeat">
      {sideData.map((elem, idx) => {
        const isActive = currentStep === idx;

        return (
          <Sidebarcomponent
            key={elem}
            step={idx+1}
            p={elem}
            isActive={isActive}
          />
        )
      })}

    </div>
  )
}

export default StepSidebar