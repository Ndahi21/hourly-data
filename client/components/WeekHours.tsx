import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Subject } from './HourColors';

type WeekHoursProps = {
  selectedSubject: Subject | null;
};

type HourAssignment = {
  color: string;
  subjectName: string;
};

export default function WeekHours({ selectedSubject }: WeekHoursProps) {
  const [paintedHours, setPaintedHours] = useState<Record<string, HourAssignment>>({});

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const startDate = dayjs('2026-01-17');

  const today = dayjs();

  const daysSinceStart = today.diff(startDate, "day");   
  const weeksSinceStart = Math.floor(daysSinceStart / 7);
  const currentWeekStart = startDate.add(weeksSinceStart * 7, "day");
  const weekStartDate = currentWeekStart.format('YYYY-MM-DD');

  const paintHourBox = (dayIndex: number, hourIndex: number) => {
    if (!selectedSubject) {
      return;
    }

    const key = `${dayIndex}-${hourIndex}`;
    setPaintedHours((prev) => ({
      ...prev,
      [key]: { color: selectedSubject.color, subjectName: selectedSubject.name },
    }));
  };

  // Auto-save to localStorage whenever painted hours change
  useEffect(() => {
    if (Object.keys(paintedHours).length > 0) {
      localStorage.setItem(`week-${weekStartDate}`, JSON.stringify(paintedHours));
    }
  }, [paintedHours, weekStartDate]);

  useEffect(() => {
    // Load from localStorage until SQL is implemented
    const savedData = localStorage.getItem(`week-${weekStartDate}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPaintedHours(parsed);
      } catch {
        // Invalid data, start fresh
        setPaintedHours({});
      }
    } else {
      setPaintedHours({});
    }
  }, [weekStartDate]);

  // User clicks then slides down to paint multiple hours:
  const [isPainting, setIsPainting] = useState(false);

  const handleMouseDown = (dayIndex: number, hourIndex: number) => {
    setIsPainting(true);
    paintHourBox(dayIndex, hourIndex);
  };

  const handleMouseEnter = (dayIndex: number, hourIndex: number) => {
    if (!isPainting) {
      return;
    }

    paintHourBox(dayIndex, hourIndex);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);
  
  return (
    <div className="p-[20px] pl-[340px]">
      <div className="fixed top-[36px] left-[340px] right-0 z-50 bg-red-500 flex">
        <div className="justify-center w-[40px] flex items-center">
          <div className="bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <ChevronLeft className="w-[24px] h-[24px] hover:cursor-pointer hover:scale-110" />
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
          <div className="bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <ChevronRight className="w-[24px] h-[24px] hover:cursor-pointer hover:scale-110" />
          </div>
        </div>
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
                className="w-[100px] h-[30px] border border-solid border-[#333333] flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: paintedHours[`${dayIndex}-${hourIndex}`]?.color ?? '#ffffff' }}
                onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                onMouseEnter={() => handleMouseEnter(dayIndex, hourIndex)}
                onMouseUp={() => setIsPainting(false)}
                title={paintedHours[`${dayIndex}-${hourIndex}`]?.subjectName ?? `${day} - ${hourIndex}:00`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}