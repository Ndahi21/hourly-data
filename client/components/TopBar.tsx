import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

export type Page = 'timetable' | 'routine' | 'tenK';

type TopBarProps = {
  activePage: Page;
  onChangePage: (page: Page) => void;
  onChangeWeekOffset: Dispatch<SetStateAction<number>>;
  currentWeekStart: Dayjs;
};

const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function TopBar({ activePage, onChangePage, onChangeWeekOffset, currentWeekStart }: TopBarProps) {

  return (
    <div className="fixed top-0 left-[340px] right-0 z-50 bg-white pt-[28px] pb-[0px]">
      {/* Page navigation header */}
      <div className="flex mb-[8px] items-center">
        {activePage === 'timetable' && (
          <>
            <div className="justify-center w-[40px] flex items-center">
              <div
                onClick={() => onChangeWeekOffset((prev) => prev - 1)}
                className="bg-white group hover:border hover:cursor-pointer hover:border-gray-400 duration-400 transition-all rounded-full w-[40px] h-[40px] flex items-center justify-center"
              >
                <ChevronLeft className="w-[24px] h-[24px] group-hover:cursor-pointer group-hover:scale-110" />
              </div>
            </div>
            <div className="justify-center w-[40px] flex items-center">
              <div
                onClick={() => onChangeWeekOffset((prev) => prev + 1)}
                className="bg-white group hover:border hover:cursor-pointer hover:border-gray-400 duration-400 transition-all rounded-full w-[40px] h-[40px] flex items-center justify-center"
              >
                <ChevronRight className="w-[24px] h-[24px] group-hover:cursor-pointer group-hover:scale-110" />
              </div>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => onChangePage('routine')}
          className={`border border-[2px] border-solid border-[#777777] p-[4px] text-center cursor-pointer w-[160px] font-bold hover:bg-gray-100 ${
            activePage === 'routine' ? 'bg-gray-200' : ''
          }`}
        >
          <p className="mx-auto mix-blend-multiply ml-[2px] mt-[4px]">
            Compare Routine
          </p>
        </button>
      </div>
      {activePage === 'timetable' && (
        <div className="flex pl-10 pt-2">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="w-[100px]">
              <h3 className="text-[16px] mb-[2px] flex justify-center">
                {day}
              </h3>
              <h3 className="text-[18px] font-bold mb-[10px] flex justify-center">
                {currentWeekStart.add(dayIndex, 'day').format('MMM DD')}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}