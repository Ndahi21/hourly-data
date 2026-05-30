import React from 'react';
import { Menu } from 'lucide-react';

export default function SideBar() {

  const subjects = [
    { name: "Sleep", color: "#535353" },
    { name: "Social", color: "#aef6ff" },
    { name: "Work", color: "#926828" },
    { name: "Art", color: "#ff0000" },
    { name: "University", color: "#7011be" },
    { name: "Computer Science", color: "#2a05ff" },
    { name: "Exercise", color: "#12d401" },
  ]

  return (
    <div className="fixed p-[20px] pt-[10px] ml-[0px] w-[280px] h-[100%] font-sans bg-white z-[1000]">
      <div className="ml-[52px]">
        <h3 className="mb-[6px] font-bold text-lg">Subjects:</h3>
        {subjects.map((subject, index) => (
          <div key={index} className="flex flex-row items-center gap-[10px] mb-[4px]">
            <div style={{ backgroundColor: subject.color }} className="w-[16px] h-[16px] border-[2px] border-black"></div>
            <p className="text-[16px] font-semibold">{subject.name}</p>
          </div>
        ))}
      </div>

      <div className="ml-[20px]">
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] py-[4px] text-center bg-gray-200 cursor-pointer mt-[12px] mb-[24px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-300">
          + Add Subject
        </div>

        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/graph.png" className="block w-[30px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p>View Analytics</p>
        </div>
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/routine.png" className="block w-[30px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p>Edit Routine</p>
        </div>
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/event.png" className="block w-[30px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p>Add Event</p>
        </div>
      </div>
    </div>
  )
}