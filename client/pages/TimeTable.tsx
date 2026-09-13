import { useState } from 'react';
import TenKGoals from '../components/TenKGoals';
import dayjs from 'dayjs';

import WeekHours from '../components/WeekHours';
import Routine from '../components/Routine';
import SideBar from '../components/SideBar';
import TopBar, { Page } from '../components/TopBar';
import Analytics from '../components/Analytics';
import { Subject } from '../components/HourColors';

export default function TimeTable() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activePage, setActivePage] = useState<Page>('timetable');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, +1 = next week

  const startDate = dayjs('2026-01-17');
  const today = dayjs();
  const daysSinceStart = today.diff(startDate, "day");
  const weeksSinceStart = Math.floor(daysSinceStart / 7);
  const currentWeekStart = startDate.add((weeksSinceStart + weekOffset) * 7, "day");

  return (
    <section>
        <TopBar
          activePage={activePage}
          onChangePage={setActivePage}
          onChangeWeekOffset={setWeekOffset}
          currentWeekStart={currentWeekStart}
        />
        <div className="flex flex-row">
          <SideBar
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            onChangePage={setActivePage}
          />
          <div className={`p-[20px] pl-[340px] ${activePage === 'timetable' ? 'pt-[150px]' : 'pt-[90px]'}`}>
            {activePage === 'timetable' && (
              <WeekHours
                selectedSubject={selectedSubject}
                currentWeekStart={currentWeekStart}
              />
            )}
            {activePage === 'routine' && (
              <Routine selectedSubject={selectedSubject} />
            )}
            {activePage === 'tenK' && (
              <TenKGoals />
            )}
          </div>
          <Analytics />
        </div>
    </section>
  )
}