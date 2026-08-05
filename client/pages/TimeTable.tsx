import { useState } from 'react';

import WeekHours from '../components/WeekHours';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import Analytics from '../components/Analytics';
import { Subject } from '../components/HourColors';

export default function TimeTable() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <section>
        <div className="fixed top-0 left-0 w-full">
          <TopBar />
        </div>
        <div className="flex flex-row mt-[80px]">
          <SideBar selectedSubject={selectedSubject} onSelectSubject={setSelectedSubject} />
          <WeekHours selectedSubject={selectedSubject} />
          <Analytics />
        </div>
    </section>
  )
}