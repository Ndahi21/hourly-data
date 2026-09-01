import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReviewDay from './ReviewDay';
import dayjs from 'dayjs';
import { Subject } from './HourColors';

type WeekHoursProps = {
  selectedSubject: Subject | null;
};

type HourAssignment = {
  color: string;
  subjectName: string;
  subjectId: number;
};

export default function WeekHours({ selectedSubject }: WeekHoursProps) {
  const [paintedHours, setPaintedHours] = useState<Record<string, HourAssignment>>({});
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, +1 = next week
  const [reviewOpenDay, setReviewOpenDay] = useState<number | null>(null);
  const [dayRatings, setDayRatings] = useState<Record<number, number>>({});
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [reviewDayModalOpen, setReviewDayModalOpen] = useState<number | null>(null);

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const startDate = dayjs('2026-01-17');

  const today = dayjs();

  const daysSinceStart = today.diff(startDate, "day");
  const weeksSinceStart = Math.floor(daysSinceStart / 7);
  const currentWeekStart = useMemo(
    () => startDate.add((weeksSinceStart + weekOffset) * 7, "day"),
    [weeksSinceStart, weekOffset]
  );
  const weekStartDate = useMemo(() => currentWeekStart.format('YYYY-MM-DD'), [currentWeekStart]);

  const paintHourBox = async (dayIndex: number, hourIndex: number) => {
    if (!selectedSubject) {
      return;
    }

    const date = currentWeekStart.add(dayIndex, 'day').format('YYYY-MM-DD');
    const key = `${dayIndex}-${hourIndex}`;

    // Special handling for "Erase" - delete the hour entry
    if (selectedSubject.name === 'Erase') {
      // Optimistically update UI
      setPaintedHours((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      // Delete from backend
      try {
        await fetch('/api/hour', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, hour: hourIndex }),
        });
      } catch (error) {
        console.error('Failed to delete hour:', error);
      }
      return;
    }

    // Normal painting - requires subject to have an id
    if (!selectedSubject.id) {
      return;
    }

    // Optimistically update UI
    setPaintedHours((prev) => ({
      ...prev,
      [key]: { color: selectedSubject.color, subjectName: selectedSubject.name, subjectId: selectedSubject.id! },
    }));

    // Save to backend
    try {
      await fetch('/api/hour', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          hour: hourIndex,
          subjectId: selectedSubject.id,
        }),
      });
    } catch (error) {
      console.error('Failed to save hour:', error);
    }
  };

  const eraseHourBox = async (dayIndex: number, hourIndex: number) => {
    const date = currentWeekStart.add(dayIndex, 'day').format('YYYY-MM-DD');
    const key = `${dayIndex}-${hourIndex}`;

    // Optimistically update UI
    setPaintedHours((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    // Delete from backend
    try {
      await fetch('/api/hour', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, hour: hourIndex }),
      });
    } catch (error) {
      console.error('Failed to delete hour:', error);
    }
  };

  // Load week data from backend
  useEffect(() => {
    const loadWeekData = async () => {
      try {
        const response = await fetch(`/api/week?startDate=${weekStartDate}`);
        if (!response.ok) {
          setPaintedHours({});
          return;
        }

        const data: { entries: Array<{ date: string; hour: number; subjectName: string; color: string; subjectId: number }> } = await response.json();
        
        // Convert API response to paintedHours format
        const hours: Record<string, HourAssignment> = {};
        data.entries.forEach((entry) => {
          const daysDiff = dayjs(entry.date).diff(currentWeekStart, 'day');
          if (daysDiff >= 0 && daysDiff < 7) {
            const key = `${daysDiff}-${entry.hour}`;
            hours[key] = {
              color: entry.color,
              subjectName: entry.subjectName,
              subjectId: entry.subjectId,
            };
          }
        });

        setPaintedHours(hours);
      } catch (error) {
        console.error('Failed to load week data:', error);
        setPaintedHours({});
      }
    };

    loadWeekData();
  }, [weekStartDate]);

  useEffect(() => {
    const loadDayRatings = async () => {
      const nextRatings: Record<number, number> = {};

      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = currentWeekStart.add(dayIndex, 'day').format('YYYY-MM-DD');

        try {
          const response = await fetch(`/api/day-rating?date=${date}`);
          if (!response.ok) {
            continue;
          }

          const data: { rating: number | null } = await response.json();
          if (data.rating) {
            nextRatings[dayIndex] = data.rating;
          }
        } catch (error) {
          console.error('Failed to load day rating:', error);
        }
      }

      setDayRatings(nextRatings);
    };

    loadDayRatings();
  }, [weekStartDate]);

  const handleDayRating = async (dayIndex: number, rating: number) => {
    const date = currentWeekStart.add(dayIndex, 'day').format('YYYY-MM-DD');

    setDayRatings((prev) => ({ ...prev, [dayIndex]: rating }));
    setReviewOpenDay(null);
    setHoveredRating(null);

    try {
      await fetch('/api/day-rating', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, rating }),
      });
    } catch (error) {
      console.error('Failed to save day rating:', error);
    }
  };

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

  const goToPreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    if (weekOffset === 1) return 'Next Week';
    if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
    return `${weekOffset} Weeks Ahead`;
  };
  
  return (
    <div className="p-[20px] pl-[340px]">
      <div className="fixed top-[28px] left-[340px] right-0 z-50 bg-white">
        {/* Week navigation header with label */}
        <div className="flex items-center justify-center mb-[8px]">
          <span className="text-[14px] font-semibold text-gray-600">{getWeekLabel()}</span>
        </div>
        <div className="flex">
          <div className="justify-center w-[40px] flex items-center">
            <div 
              onClick={goToPreviousWeek}
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
              onClick={goToNextWeek}
              className="bg-white group hover:border hover:cursor-pointer hover:border-gray-400 duration-400 transition-all rounded-full w-[40px] h-[40px] flex items-center justify-center"
            >
            <ChevronRight className="w-[24px] h-[24px] group-hover:cursor-pointer group-hover:scale-110" />
          </div>
        </div>
        </div>
      </div>

      <div className="pt-[24px] flex flex-row">
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
                className="w-[100px] h-[30px] border border-solid border-black flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: paintedHours[`${dayIndex}-${hourIndex}`]?.color ?? '#ffffff' }}
                onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                onMouseEnter={() => handleMouseEnter(dayIndex, hourIndex)}
                onMouseUp={() => setIsPainting(false)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  eraseHourBox(dayIndex, hourIndex);
                }}
                title={paintedHours[`${dayIndex}-${hourIndex}`]?.subjectName ?? `${day} - ${hourIndex}:00`}
              />
            ))}
            <div className="text-[16px] text-center mt-[4px] relative">
              <div
                className="relative inline-block"
                onMouseEnter={() => setReviewOpenDay(dayIndex)}
                onMouseLeave={() => {
                  setReviewOpenDay((prev) => (prev === dayIndex ? null : prev));
                  setHoveredRating(null);
                }}
              >
                <button
                  className="flex justify-center items-center hover:text-yellow-600 transition-colors"
                  onFocus={() => setReviewOpenDay(dayIndex)}
                  onBlur={() => setReviewOpenDay(null)}
                  aria-expanded={reviewOpenDay === dayIndex}
                >
                  Review {dayRatings[dayIndex] ? `(${dayRatings[dayIndex]}/5)` : '☆'}
                </button>

                {reviewOpenDay === dayIndex && (
                  <div
                    className="absolute left-1/2 bottom-[24px] z-20 flex flex-col -translate-x-1/2 items-center gap-[4px] rounded-md border border-gray-200 bg-white p-[8px] shadow-lg"
                    onMouseEnter={() => setReviewOpenDay(dayIndex)}
                    onMouseLeave={() => {
                      setReviewOpenDay(null);
                      setHoveredRating(null);
                    }}
                  >
                    <button 
                      onClick={() => setReviewDayModalOpen(dayIndex)}
                      className="text-[12px] border border-gray-300 px-[24px] py-[6px] font-medium text-gray-700
                      hover:bg-gray-100 transition-colors rounded-[4px] mb-[4px]"
                    >
                      Review Day
                    </button>
                    <div className="flex items-center gap-[4px]">
                      {Array.from({ length: 5 }, (_, index) => {
                        const starValue = index + 1;
                        const activeValue = hoveredRating ?? dayRatings[dayIndex] ?? 0;

                        return (
                          <button
                            key={starValue}
                            type="button"
                            aria-label={`Rate ${starValue} out of 5`}
                            className="p-[2px] transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(starValue)}
                            onMouseLeave={() => setHoveredRating(null)}
                            onClick={() => handleDayRating(dayIndex, starValue)}
                          >
                            <Star
                              className={`h-[18px] w-[18px] ${starValue <= activeValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Day Modal - render once for all days */}
      {days.map((_day, dayIndex) => (
        <ReviewDay
          key={dayIndex}
          isOpen={reviewDayModalOpen === dayIndex}
          onClose={() => setReviewDayModalOpen(null)}
        />
      ))}
    </div>
  );
}