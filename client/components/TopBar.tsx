export default function TopBar() {

  return (
    <div className="fixed top-[28px] left-[340px] right-0 z-50 bg-white">
      {/* Page navigation header */}
      <div className="flex mb-[8px]">
        {navButtons.map((button) => (
          <button
            key={button.id}
            type="button"
            onClick={() => setActivePage(button.id)}
            className={`border border-[2px] border-solid border-[#777777] p-[4px] text-center cursor-pointer w-[160px] font-bold hover:bg-gray-100 ${
              activePage === button.id ? 'bg-gray-200' : ''
            }`}
          >
            <p className="mx-auto mix-blend-multiply ml-[2px] mt-[4px]">
              {button.label}
            </p>
          </button>
        ))}
        {activePage === 'timetable' && (
          <span className="text-[14px] pl-[28px] font-semibold text-gray-600">{getWeekLabel()}</span>
        )}
      </div>
      {activePage === 'timetable' && (
        <div className="flex">
          <div className="justify-center w-[40px] flex items-center">
            <div 
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="bg-white group hover:border hover:cursor-pointer hover:border-gray-400 duration-400 transition-all rounded-full w-[40px] h-[40px] flex items-center justify-center"
            >
              <ChevronLeft className="w-[24px] h-[24px] group-hover:cursor-pointer group-hover:scale-110" />
            </div>
          </div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="w-[100px]">
              <h3 className="text-[16px] mb-[2px] flex justify-center">
                {day}
              </h3>
              <h3 className="text-[18px] font-bold mb-[10px] flex justify-center">
                {currentWeekStart.add(dayIndex, "day").format('MMM DD')}
              </h3>
            </div>
          ))}
          <div className="justify-center w-[40px] flex items-center">
            <div 
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="bg-white group hover:border hover:cursor-pointer hover:border-gray-400 duration-400 transition-all rounded-full w-[40px] h-[40px] flex items-center justify-center"
            >
            <ChevronRight className="w-[24px] h-[24px] group-hover:cursor-pointer group-hover:scale-110" />
          </div>
        </div>
        </div>
      )}
    </div>
    <button>
      Compare Routine
    </button>
  );
}