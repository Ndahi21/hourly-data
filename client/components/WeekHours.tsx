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
    <div className="flex flex-row p-[20px] pl-[320px]">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-[30px]">
          <div className="bg-red-500 sticky top-0">
            <h3  className="text-[18px] font-bold mb-[10px] justify-center items-center flex">{day}</h3>
            <h3  className="text-[18px] font-bold mb-[10px] justify-center items-center flex">{currentWeekStart.add(dayIndex, "day").format('MMM DD')}</h3>
          </div>

          <div className="flex gap-[28px]">
            <div className="gap-[28px] flex-nowrap overflow-x-auto">
              {Array.from({ length: 24 }, (_, hourIndex) => (
                <div
                  key={hourIndex} 
                  className="w-[100px] h-[30px] border border-solid border-[#333333] flex items-center justify-center cursor-pointer"
                  title={`${day} - ${hourIndex}:00`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#93c5fd'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <span className="text-[12px]">{hourIndex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}