import React, { useState } from 'react';
import HourColors, { Subject } from './HourColors';

const defaultSubjects: Subject[] = [
  { name: 'Sleep', color: '#535353' },
  { name: 'Social', color: '#aef6ff' },
  { name: 'Work', color: '#926828' },
  { name: 'Art', color: '#ff0000' },
  { name: 'University', color: '#7011be' },
  { name: 'Computer Science', color: '#2a05ff' },
  { name: 'Exercise', color: '#12d401' },
];

const colorChoices = [
  // Picnic Theme
  '#4336a8',
  '#bbe6ff',
  '#3e9955',
  '#ddef8d',
  '#d40101',
  // SpeechPod Theme
  '#ff6f61',
  '#6b5b95',
  '#88b04b',
  '#f7cac9',
  '#92a8d1',
  // Material Design Theme
  '#e57373',
  '#64b5f6',
  '#81c784',
  '#ffb74d',
  '#4db6ac',
];

type SideBarProps = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export default function SideBar({ selectedColor, onSelectColor }: SideBarProps) {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState(colorChoices[0]);

  const saveSubject = () => {
    const cleanName = newSubjectName.trim();

    if (!cleanName) {
      return;
    }

    setSubjects((prev) => [...prev, { name: cleanName, color: newSubjectColor }]);
    onSelectColor(newSubjectColor);
    setNewSubjectName('');
    setNewSubjectColor(colorChoices[0]);
    setIsAddOpen(false);
  };

  const closeModal = () => {
    setNewSubjectName('');
    setNewSubjectColor(colorChoices[0]);
    setIsAddOpen(false);
  };

  return (
    <>
      <div className="fixed p-[20px] pt-[10px] ml-[0px] w-[300px] h-[100%] font-sans bg-white z-[1000]">
      <HourColors subjects={subjects} selectedColor={selectedColor} onSelectColor={onSelectColor} />

      <div className="ml-[20px]">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="border border-[2px] border-solid border-[#777777] p-[10px] py-[4px] text-center bg-gray-200 cursor-pointer mt-[12px] mb-[24px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-300"
        >
          + Add Subject
        </button>

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

      {isAddOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/35 flex items-center justify-center px-[12px]">
          <div className="bg-white border border-gray-400 rounded-[8px] p-[16px] w-[420px] shadow-lg">
            <h2 className="text-[18px] font-bold mb-[10px]">Add Subject</h2>

            <label className="text-[14px] font-semibold">Subject Name</label>
            <input
              type="text"
              value={newSubjectName}
              onChange={(event) => setNewSubjectName(event.target.value)}
              className="border border-gray-400 p-[6px] w-full mb-[12px] rounded-[4px]"
              placeholder="Enter subject name"
            />

            <label className="text-[14px] font-semibold">Subject Color</label>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px] mb-[14px]">
              <div>
                <p className="text-[12px] font-semibold mb-[6px]">Theme Colors</p>
                <div className="grid grid-cols-5 gap-[8px]">
                {colorChoices.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewSubjectColor(color)}
                    className={`w-[28px] h-[28px] rounded-[4px] border ${newSubjectColor === color ? 'border-black border-[3px]' : 'border-gray-400'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold mb-[6px]">Color Spectrum</p>
                <input
                  type="color"
                  value={newSubjectColor}
                  onChange={(event) => setNewSubjectColor(event.target.value)}
                  className="w-full h-[44px] p-0 border border-gray-300 rounded-[4px] cursor-pointer"
                />
                <p className="text-[12px] mt-[8px] text-gray-700">Selected: {newSubjectColor}</p>
              </div>
            </div>

            <div className="flex gap-[8px] justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-[10px] py-[6px] border border-gray-400 rounded-[4px] font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSubject}
                className="px-[12px] py-[6px] border border-black rounded-[4px] font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}