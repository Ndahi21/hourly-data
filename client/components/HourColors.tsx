import React from 'react';
import { Expand, Trash } from 'lucide-react';

export type Subject = {
  name: string;
  color: string;
};

type HourColorsProps = {
  subjects: Subject[];
};

export default function HourColors({ subjects }: HourColorsProps) {

  return (
    <>
      <div className="ml-[52px]">
        <div className="flex flex-row items-center mb-[6px]">
          <h3 className="mb-[6px] font-bold text-lg">Subjects:</h3>
          <div className="flex flex-row ml-auto items-center gap-[8px]">
            <Expand className="w-[16px] h-[16px] hover:cursor-pointer hover:scale-110" />
            <Trash className="w-[16px] h-[16px] hover:cursor-pointer hover:scale-110" />
          </div>
        </div>
        {subjects.map((subject, index) => (
          <div key={`${subject.name}-${index}`} className="flex flex-row items-center gap-[10px] mb-[4px]">
            <div style={{ backgroundColor: subject.color }} className="w-[16px] h-[16px] border-[2px] border-black"></div>
            <p className="text-[16px] font-semibold">{subject.name}</p>
          </div>
        ))}
      </div>

    </>
  );
}