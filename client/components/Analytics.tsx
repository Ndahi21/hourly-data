import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Analytics() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tall vertical bar with chevron */}
      <div 
        className={`fixed top-[100px] w-[40px] h-[calc(100vh-80px)] bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center z-[999] transition-all ${
          isOpen ? 'right-[380px]' : 'right-0'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight className="w-[24px] h-[24px]" />
        ) : (
          <ChevronLeft className="w-[24px] h-[24px]" />
        )}
      </div>

      {/* Analytics panel */}
      {isOpen && (
        <div className="fixed top-[80px] right-0 w-[380px] h-[calc(100vh-80px)] bg-gray-100 p-[20px] z-[1000]">
          {/* Be a simple table of subjects and hours */}
          <div className="w-[100px] h-[100px] p-[10px] bg-gray-300">
            
          </div>
          {/* Be a visual representation of the data */}
          <div className="w-[200px] h-[200px] m-[10px] bg-gray-300"></div>
          <div className="w-[100px] h-[50px] bg-gray-300">Expand Analytics</div>
        </div>
      )}
    </>
  );
}