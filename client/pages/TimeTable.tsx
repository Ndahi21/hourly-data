import { useState } from 'react';

import WeekHours from '../components/WeekHours';
import Routine from '../components/Routine';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import Analytics from '../components/Analytics';
import { Subject } from '../components/HourColors';

export default function TimeTable() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isRoutineMode, setIsRoutineMode] = useState(false);

  return (
    <section>
        <div className="fixed top-0 left-0 w-full">
          <TopBar />
        </div>
        <div className="flex flex-row mt-[80px]">
          <SideBar 
            selectedSubject={selectedSubject} 
            onSelectSubject={setSelectedSubject}
            isRoutineMode={isRoutineMode}
            onToggleRoutineMode={() => setIsRoutineMode(!isRoutineMode)}
          />
          {isRoutineMode ? (
            <Routine selectedSubject={selectedSubject} />
          ) : (
            <>
              <WeekHours selectedSubject={selectedSubject} />
              <Analytics />
            </>
          )}
        </div>
    </section>
  )
}