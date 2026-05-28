import React from 'react';
import { Menu } from 'lucide-react';

export default function SideBar() {

  return (
    <div className="fixed p-[20px] ml-[0px] w-[280px] h-[100%] font-sans bg-white z-[1000]">
      <div className="ml-[52px]">
        <h3 className="mb-[10px] font-bold text-lg">Subjects:</h3>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#535353]"></div>
          <span className="ml-[12px] text-[18px]">Sleep</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#aef6ff]"></div>
          <span className="ml-[12px] text-[18px]">Social</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#4444a5]"></div>
          <span className="ml-[12px] text-[18px]">University</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#2a05ff]"></div>
          <span className="ml-[12px] text-[18px]">Computer Science</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#fc0000]"></div>
          <span className="ml-[12px] text-[18px]">Art</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#14db02]"></div>
          <span className="ml-[12px] text-[18px]">Exercise</span>
        </div>
        <div className="flex flex-row items-center pb-[6px]">
          <div className="w-[18px] h-[18px] border-[3px] border-black bg-[#a97d3b]"></div>
          <span className="ml-[12px] text-[18px]">Organization</span>
        </div>
      </div>

      <div className="ml-[20px]">
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          + Add Subject
        </div>
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/graph.png" className="w-[30px] pl-[45px]"/>
          <p>View Analytics</p>
        </div>
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/routine.png" className="w-[30px] pl-[47px]"/>
          <p>Edit Routine</p>
        </div>
        <div className="border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <img src="/event.png" className="w-[30px] pl-[50px]"/>
          <p>Add Event</p>
        </div>
      </div>
    </div>
  )
}