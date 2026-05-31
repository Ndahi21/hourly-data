import React, { useState } from 'react';

type Subject = {
  name: string;
  color: string;
};

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
  '#535353',
  '#aef6ff',
  '#926828',
  '#ff0000',
  '#7011be',
  '#2a05ff',
  '#12d401',
  '#ff9f1c',
  '#0ea5e9',
  '#ec4899',
];

export default function HourColors() {
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
      <div className="ml-[52px]">
        <h3 className="mb-[6px] font-bold text-lg">Subjects:</h3>
        {subjects.map((subject, index) => (
          <div key={`${subject.name}-${index}`} className="flex flex-row items-center gap-[10px] mb-[4px]">
            <div style={{ backgroundColor: subject.color }} className="w-[16px] h-[16px] border-[2px] border-black"></div>
            <p className="text-[16px] font-semibold">{subject.name}</p>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="border border-[2px] border-solid border-[#777777] p-[10px] py-[4px] text-center bg-gray-200 cursor-pointer mt-[12px] mb-[24px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-300"
        >
          + Add Subject
        </button>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/35 flex items-center justify-center px-[12px]">
          <div className="bg-white border border-gray-400 rounded-[8px] p-[16px] w-[320px] shadow-lg">
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
            <div className="grid grid-cols-5 gap-[8px] mt-[6px] mb-[14px]">
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
  );
}