import { useEffect, useState } from 'react';
import HourColors, { Subject } from './HourColors';
import { Users } from 'lucide-react';

const defaultSubjects: Subject[] = [
  { name: 'Erase', color: '#ffffff' },
  { name: 'Sleep', color: '#535353' },
  { name: 'Social', color: '#aef6ff' },
  { name: 'Work', color: '#926828' },
  { name: 'Art', color: '#e60000' },
  { name: 'Maintenance', color: '#07037c' },
  { name: 'Computer Science', color: '#2a05ff' },
  { name: 'Exercise', color: '#10c500' },
];

const colorChoices = [
  // Default Theme
  '#926828',
  '#e60000',
  '#07037c',
  '#2a05ff',
  '#10c500',
  // Picnic Theme
  '#4336a8',
  '#bbe6ff',
  '#3e9955',
  '#ddef8d',
  '#d40101',
  // Material Design Theme
  '#e57373',
  '#64b5f6',
  '#81c784',
  '#ffb74d',
  '#4db6ac',
];

const colorThemes = [
  'Default',
  'Picnic',
  'Material',
];

type SideBarProps = {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
};

export default function SideBar({ selectedSubject, onSelectSubject }: SideBarProps) {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: 'Erase', color: '#ffffff' }, ...defaultSubjects]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState(colorChoices[0]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) {
          return;
        }

        const data: { subjects: Subject[] } = await response.json();
        if (data.subjects.length > 0) {
          // Always prepend "Erase" as a frontend-only tool
          const subjectsWithErase = [{ name: 'Erase', color: 'white' }, ...data.subjects];
          setSubjects(subjectsWithErase);
          onSelectSubject(data.subjects[0]);
        }
      } catch {
        // Keep local defaults if the API is not running.
      }
    };

    loadSubjects();
  }, [onSelectSubject]);

  const saveSubject = async () => {
    const cleanName = newSubjectName.trim();

    if (!cleanName) {
      return;
    }

    const newSubject = { name: cleanName, color: newSubjectColor };

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });

      if (!response.ok) {
        return;
      }

      const data: { subject: Subject } = await response.json();
      setSubjects((prev) => [...prev, data.subject]);
      onSelectSubject(data.subject);
    } catch {
      // Fallback for offline development.
      setSubjects((prev) => [...prev, newSubject]);
      onSelectSubject(newSubject);
    }

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
      <HourColors subjects={subjects} selectedSubject={selectedSubject} onSelectSubject={onSelectSubject} />

      <div className="ml-[20px]">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="border border-[2px] border-solid border-[#777777] p-[10px] py-[4px] text-center bg-gray-200 cursor-pointer mt-[12px] mb-[24px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-300"
        >
          + Add Subject
        </button>

        <div className="grid grid-cols-3 border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
          <Users className="block w-[24px] mr-[10px] h-[30px] mx-auto mb-[4px] object-contain"/>
          <p className="col-span-2 mx-auto mix-blend-multiply ml-[2px] mt-[4px]">Add Event</p>
        </div>
         <button
          type="button"
          className="grid grid-cols-4 border border-[2px] border-solid border-[#777777] p-[10px] text-center cursor-pointer mt-[12px] w-[240px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100"
        >
          <p className="col-span-3 mx-auto mix-blend-multiply ml-[2px] mt-[4px]">Compare Routine
          </p>
        </button>
      </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/35 flex items-center justify-center px-[12px]">
          <div className="bg-white border border-gray-400 rounded-[8px] p-[16px] px-[24px] w-[520px] shadow-lg">
            <h2 className="text-[18px] font-bold mb-[10px]">Add Subject</h2>

            <label className="text-[14px] font-semibold">Subject Name</label>
            <input
              type="text"
              value={newSubjectName}
              onChange={(event) => setNewSubjectName(event.target.value)}
              className="border border-gray-400 p-[6px] w-full mb-[12px] mt-[6px] rounded-[4px]"
              placeholder="Enter subject name"
            />

            <label className="text-[14px] font-semibold mb-[6px]">Subject Colors</label>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px] mb-[14px]">
              <div className="space-y-[8px]">
                {colorThemes.map((theme, themeIndex) => (
                  <div key={theme} className="flex items-center gap-[8px]">
                    <p className="text-[12px] font-semibold w-[60px]">{theme}</p>
                    <div className="flex gap-[8px]">
                      {colorChoices.slice(themeIndex * 5, (themeIndex + 1) * 5).map((color) => (
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
                ))}
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