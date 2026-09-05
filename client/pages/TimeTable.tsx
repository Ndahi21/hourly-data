import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

import WeekHours from '../components/WeekHours';
import Routine from '../components/Routine';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import Analytics from '../components/Analytics';
import { Subject } from '../components/HourColors';

export default function TimeTable() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activePage, setActivePage] = useState<'timetable' | 'routine' | 'tenK' | 'tasks'>('timetable');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, +1 = next week

  const startDate = dayjs('2026-01-17');
  const today = dayjs();
  const daysSinceStart = today.diff(startDate, "day");
  const weeksSinceStart = Math.floor(daysSinceStart / 7);
  const currentWeekStart = startDate.add((weeksSinceStart + weekOffset) * 7, "day");

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    if (weekOffset === 1) return 'Next Week';
    if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
    return `${weekOffset} Weeks Ahead`;
  };

  const navButtons: Array<{ id: typeof activePage; label: string }> = [
    { id: 'timetable', label: 'Time Table' },
    { id: 'routine', label: 'Edit Routine' },
    { id: 'tenK', label: '10K Challenge' },
    { id: 'tasks', label: 'Task Master' },
  ];

  return (
    <section>
        <div className="fixed top-0 left-0 w-full">
          <TopBar />
        </div>
        <div className="flex flex-row mt-[80px]">
          <SideBar 
            selectedSubject={selectedSubject} 
            onSelectSubject={setSelectedSubject}
          />
          <div className="p-[20px] pl-[340px]">
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

            {activePage === 'timetable' && (
              <WeekHours
                selectedSubject={selectedSubject}
                currentWeekStart={currentWeekStart}
              />
            )}
            {activePage === 'routine' && (
              <div className="pt-[24px]">
                <Routine selectedSubject={selectedSubject} />
              </div>
            )}
            {activePage === 'tenK' && (
              <div className="pt-[24px]">
                <h2 className="text-[24px] font-bold">10K Challenge</h2>
                <p className="text-[14px] text-gray-600">Coming soon.</p>
              </div>
            )}
            {activePage === 'tasks' && (
              <div className="pt-[24px]">
                <h2 className="text-[24px] font-bold">Task Master</h2>
                <p className="text-[14px] text-gray-600">Coming soon.</p>
              </div>
            )}
          </div>
          {activePage === 'timetable' && <Analytics />}
        </div>
    </section>
  )
}