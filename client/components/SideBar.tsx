import React from 'react';
import HourColors from './HourColors';

export default function SideBar() {

  return (
    <div className="fixed p-[20px] pt-[10px] ml-[0px] w-[280px] h-[100%] font-sans bg-white z-[1000]">
      <HourColors />

      <div className="ml-[20px]">
        <div className="flex border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/graph.png" className="block w-[30px] mr-[10px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p className="mx-auto ml-[2px] mt-[4px]">View Analytics</p>
        </div>
        <div className="flex border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/routine.png" className="block w-[30px] mr-[10px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p className="mx-auto ml-[2px] mt-[4px]">Edit Routine</p>
        </div>
        <div className="flex border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/images/event.png" className="block w-[30px] mr-[10px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p className="mx-auto ml-[2px] mt-[4px]">Add Event</p>
        </div>
      </div>
    </div>
  )
}