import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export default function Analytics() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Tall vertical bar with chevron */}
      <div 
        className={`fixed top-[100px] w-[40px] h-[calc(100vh-80px)] bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center z-[999] duration-700 transition-all ${
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
        <div className="fixed top-[40px] right-0 w-[380px] h-[calc(120vh-80px)] bg-gray-100 p-[20px] z-[1000]">
          <div className="flex flex-row items-center mb-[20px]">
            <img src="/graph.png" className="w-[30px] h-[30px] mr-[10px] object-contain"/>
            <h2 className="text-[22px] font-bold">Analytics</h2>
          </div>
          {/* Be a simple table of subjects and hours */}
          <div className="w-[300px] h-[200px] bg-gray-300">
            
          </div>
          {/* Be a visual representation of the data */}
          <div className="w-[300px] h-[200px] my-[10px] bg-gray-300"></div>
          <div className="flex flex-row items-center justify-center border border-[2px] border-solid border-[#777777] p-[10px] text-center bg-white cursor-pointer mt-[12px] w-[300px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
            <Expand className="w-[20px] h-[20px] mr-[8px]" />
            <p>Expand Analytics</p>
          </div>
        </div>
      )}
    </>
  );
}