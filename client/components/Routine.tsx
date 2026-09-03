import { useEffect, useState } from 'react';
import { Subject } from './HourColors';
import { Save } from 'lucide-react';

type RoutineProps = {
  selectedSubject: Subject | null;
};

type HourAssignment = {
  color: string;
  subjectName: string;
  subjectId: number;
};

const formatSlot = (slot: number) => {
  const hour = Math.floor(slot / 2);
  const displayHour = hour === 0 ? 1 : hour < 12 ? hour : hour - 12;
  const period = hour < 12 ? 'am' : 'pm';
  return `${displayHour} ${period}`;
};

export default function Routine({ selectedSubject }: RoutineProps) {
  const [routineHours, setRoutineHours] = useState<Record<string, HourAssignment>>({});
  const [isPainting, setIsPainting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Load routine template from backend
  useEffect(() => {
    const loadRoutine = async () => {
      try {
        const response = await fetch('/api/routine');
        if (!response.ok) {
          setRoutineHours({});
          return;
        }

        const data: { entries: Array<{ dayOfWeek: number; slot: number; subjectName: string; color: string; subjectId: number }> } = await response.json();
        
        // Convert API response to routineHours format
        const hours: Record<string, HourAssignment> = {};
        data.entries.forEach((entry) => {
          const key = `${entry.dayOfWeek}-${entry.slot}`;
          hours[key] = {
            color: entry.color,
            subjectName: entry.subjectName,
            subjectId: entry.subjectId,
          };
        });

        setRoutineHours(hours);
      } catch (error) {
        console.error('Failed to load routine:', error);
        setRoutineHours({});
      }
    };

    loadRoutine();
  }, []);

  const paintHourBox = (dayIndex: number, slotIndex: number) => {
    if (!selectedSubject) {
      return;
    }

    const key = `${dayIndex}-${slotIndex}`;

    // Special handling for "Erase" - delete the hour entry
    if (selectedSubject.name === 'Erase') {
      setRoutineHours((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      return;
    }

    // Normal painting - requires subject to have an id
    if (!selectedSubject.id) {
      return;
    }

    setRoutineHours((prev) => ({
      ...prev,
      [key]: { color: selectedSubject.color, subjectName: selectedSubject.name, subjectId: selectedSubject.id! },
    }));
  };

  const eraseHourBox = (dayIndex: number, slotIndex: number) => {
    const key = `${dayIndex}-${slotIndex}`;
    setRoutineHours((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const saveRoutine = async () => {
    setIsSaving(true);
    try {
      // Convert routineHours to API format
      const entries = Object.entries(routineHours).map(([key, value]) => {
        const [dayOfWeek, slot] = key.split('-').map(Number);
        return {
          dayOfWeek,
          slot,
          subjectId: value.subjectId,
        };
      });

      await fetch('/api/routine', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      });

      alert('Routine saved successfully!');
    } catch (error) {
      console.error('Failed to save routine:', error);
      alert('Failed to save routine');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = (dayIndex: number, slotIndex: number) => {
    setIsPainting(true);
    paintHourBox(dayIndex, slotIndex);
  };

  const handleMouseEnter = (dayIndex: number, slotIndex: number) => {
    if (!isPainting) {
      return;
    }
    paintHourBox(dayIndex, slotIndex);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="p-[20px] pl-[340px]">
      <div className="sticky top-[80px] z-50 bg-white pb-[16px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[12px]">
          <div>
            <h2 className="text-[24px] font-bold">Edit Weekly Routine</h2>
            <p className="text-[14px] text-gray-600">Plan your ideal weekly schedule template</p>
          </div>
          <button
            type="button"
            onClick={saveRoutine}
            disabled={isSaving}
            className="flex items-center gap-[8px] bg-blue-600 text-white px-[16px] py-[8px] rounded-[6px] font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-[18px] h-[18px]" />
            {isSaving ? 'Saving...' : 'Save Routine'}
          </button>
        </div>

        {/* Day headers */}
        <div className="flex">
          <div className="w-[60px]"></div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="w-[100px] flex justify-center text-center">
              <h3 className="font-bold mb-[2px]">
                {day}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row">
        <div className="text-right pr-[8px] pt-[36px] text-[12px] gap-[30px] flex flex-col">
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
            {Array.from({ length: 48 }, (_, slotIndex) => {
              // Every even slot is the top of a new hour (30 min slots)
              const isHourStart = slotIndex % 2 === 0;
              return (
                <div
                  key={slotIndex}
                  className={`w-[100px] h-[24px] border-black border-r border-t-black cursor-pointer ${
                    isHourStart ? 'border-t-2 border-t-black' : 'border-t border-t-gray-900'
                  } ${slotIndex === 47 ? 'border-b border-b-black' : ''}`}
                  style={{ backgroundColor: routineHours[`${dayIndex}-${slotIndex}`]?.color || 'transparent' }}
                  onMouseDown={() => handleMouseDown(dayIndex, slotIndex)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                  onMouseUp={() => setIsPainting(false)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    eraseHourBox(dayIndex, slotIndex);
                  }}
                  title={routineHours[`${dayIndex}-${slotIndex}`]?.subjectName ?? `${day} - ${formatSlot(slotIndex)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}