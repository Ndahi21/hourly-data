import React, { useState } from 'react';

import WeekHours from '../components/WeekHours';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';

export default function TimeTable() {
  const [selectedColor, setSelectedColor] = useState('#535353');

  return (
    <section>
        <div className="fixed top-0 left-0 w-full">
          <TopBar />
        </div>
        <div className="flex flex-row mt-[80px]">
          <SideBar selectedColor={selectedColor} onSelectColor={setSelectedColor} />
          <WeekHours selectedColor={selectedColor} />
        </div>
    </section>
  )
}