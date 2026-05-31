import React from 'react';

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
        <h3 className="mb-[6px] font-bold text-lg">Subjects:</h3>
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