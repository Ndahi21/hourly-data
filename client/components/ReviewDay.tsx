import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const dayWas = ['Happy', 'Meh', 'Sad'];
const dayMood = ['Energetic', 'Neutral', 'Tired'];

const food = ['Coffee', 'Sugar', 'Fast Food'];
const activity = ['Work', 'Relaxation', 'Flea Market', 'Socializing', 'Exercise', 'Gaming', 'Reading', 'Cooking', 'Shopping', 'Traveling'];

interface ReviewDayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewDay({ isOpen, onClose }: ReviewDayProps) {
  return (
    <>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-[8px] p-[20px] shadow-lg">
            <button
              onClick={onClose}
              className="absolute top-[8px] right-[8px] p-[4px] hover:bg-gray-100 rounded-[4px]"
              aria-label="Close"
            >
              <X className="w-[18px] h-[18px]" />
            </button>

            <p>Today's day was:</p>
            {dayWas.map((day) => (
              <button key={day} className="bg-gray-200 px-[6px] py-[2px] rounded-[4px] mb-[8px] mr-[8px]">{day}</button>
            ))}

            <p>Today's mood was:</p>
            {dayMood.map((day) => (
              <button key={day} className="bg-gray-200 px-[6px] py-[2px] rounded-[4px] mb-[8px] mr-[8px]">{day}</button>
            ))}

            <p>Today's food intake was:</p>
            {food.map((item) => (
              <button key={item} className="bg-gray-200 px-[6px] py-[2px] rounded-[4px] mb-[8px] mr-[8px]">{item}</button>
            ))}

            <p>Today's activities were:</p>
            {activity.map((item) => (
              <button key={item} className="bg-gray-200 px-[6px] py-[2px] rounded-[4px] mb-[8px] mr-[8px]">{item}</button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}