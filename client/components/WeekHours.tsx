import React from 'react';
import dayjs from 'dayjs';

export default function WeekHours() {

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const startDate = dayjs('2026-01-17');

  const today = dayjs();
  const deliveryDate = today.format('DD');

  const daysSinceStart = today.diff(startDate, "day");   
  const weeksSinceStart = Math.floor(daysSinceStart / 7);
  const currentWeekStart = startDate.add(weeksSinceStart * 7, "day");
  
  return (
    <div className="p-[20px] pl-[340px]">
      <div className="fixed top-[36px] left-[340px] right-0 z-50 bg-red-500 flex">
        <div className="text-transparent w-[40px]">
          .
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
      </div>

      <div className="pt-[4px] flex flex-row">
        <div className="text-right pr-[8px] pt-[14px] text-[12px] gap-[12px] flex flex-col">
          <div>1 am</div>
          <div>2 am</div>
          <div>3 am</div>
          <div>4 am</div>
          <div>5 am</div>
          <div>6 am</div>
          <div>7 am</div>
          <div>8 am</div>
          <div>9 am</div>
          <div>10 am</div>
          <div>11 am</div>
          <div>12 pm</div>
          <div>1 pm</div>
          <div>2 pm</div>
          <div>3 pm</div>
          <div>4 pm</div>
          <div>5 pm</div>
          <div>6 pm</div>
          <div>7 pm</div>
          <div>8 pm</div>
          <div>9 pm</div>
          <div>10 pm</div>
          <div>11 pm</div>
          <div>12 am</div>
        </div>

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