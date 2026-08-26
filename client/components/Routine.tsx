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

export default function Routine({ selectedSubject }: RoutineProps) {
  const [routineHours, setRoutineHours] = useState<Record<string, HourAssignment>>({});
  const [isPainting, setIsPainting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Load routine template from backend
  useEffect(() => {
    const loadRoutine = async () => {
      try {
        const response = await fetch('/api/routine');
        if (!response.ok) {
          setRoutineHours({});
          return;
        }

        const data: { entries: Array<{ dayOfWeek: number; hour: number; subjectName: string; color: string; subjectId: number }> } = await response.json();
        
        // Convert API response to routineHours format
        const hours: Record<string, HourAssignment> = {};
        data.entries.forEach((entry) => {
          const key = `${entry.dayOfWeek}-${entry.hour}`;
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

  const paintHourBox = (dayIndex: number, hourIndex: number) => {
    if (!selectedSubject) {
      return;
    }

    const key = `${dayIndex}-${hourIndex}`;

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

  const eraseHourBox = (dayIndex: number, hourIndex: number) => {
    const key = `${dayIndex}-${hourIndex}`;
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
        const [dayOfWeek, hour] = key.split('-').map(Number);
        return {
          dayOfWeek,
          hour,
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
      <div className="fixed top-[80px] left-[340px] right-0 z-50 bg-white pb-[16px]">
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
            <div key={dayIndex} className="w-[100px]">
              <h3 className="text-[16px] font-bold mb-[10px] flex justify-center">
                {day}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[120px] flex flex-row">
        <div className="text-right pr-[8px] pt-[14px] text-[12px] gap-[12px] flex flex-col">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i}>
              {i === 0 ? '1 am' : i < 11 ? `${i + 1} am` : i === 11 ? '12 pm' : i < 23 ? `${i - 11} pm` : '12 am'}
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="">
            {Array.from({ length: 24 }, (_, hourIndex) => (
              <div
                key={hourIndex}
                className="w-[100px] h-[30px] border border-solid border-black flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: routineHours[`${dayIndex}-${hourIndex}`]?.color ?? '#ffffff' }}
                onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                onMouseEnter={() => handleMouseEnter(dayIndex, hourIndex)}
                onMouseUp={() => setIsPainting(false)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  eraseHourBox(dayIndex, hourIndex);
                }}
                title={routineHours[`${dayIndex}-${hourIndex}`]?.subjectName ?? `${day} - ${hourIndex}:00`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}