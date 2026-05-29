import React from 'react';
import dayjs from 'dayjs';

export default function WeekHours() {

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const startDate = dayjs('2026-01-17');

  const today = dayjs();
  const deliveryDate = today.format('DD');

  const daysSinceStart = today.diff(startDate, "day");      // Total days passed since start
  const weeksSinceStart = Math.floor(daysSinceStart / 7);   // How many full weeks have passed
  const currentWeekStart = startDate.add(weeksSinceStart * 7, "day");
  
  return (
    <div className="p-[20px] pl-[340px]">
      <div className="fixed top-[36px] left-[340px] right-0 z-50 bg-red-500 flex">
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="w-[100px]">
            <h3 className="text-[18px] font-bold mb-[10px] flex justify-center">
              {day}
            </h3>
            <h3 className="text-[18px] font-bold mb-[10px] flex justify-center">
              {currentWeekStart.add(dayIndex, "day").format('MMM DD')}
            </h3>
          </div>
        ))}
      </div>

      <div className="pt-[14px] flex flex-row">
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="">
            {Array.from({ length: 24 }, (_, hourIndex) => (
              <div
                key={hourIndex}
                className="w-[100px] h-[30px] border border-solid border-[#333333] flex items-center justify-center cursor-pointer bg-white"
                title={`${day} - ${hourIndex}:00`}
              >
                <span className="text-[12px]">{hourIndex}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}