import { Menu } from 'lucide-react';

export default function TopBar() {

  return (
    <div className="fixed p-[20px] ml-[0px] w-[100%] h-[80px] font-sans bg-white z-[1000]">
      <div className="flex flex-row items-center justify-start gap-[10px]">
        <div className="border w-[38px] h-[38px] flex items-center justify-center rounded-[8px] bg-gray-200 cursor-pointer hover:bg-gray-300">
          <Menu className="w-[24px] h-[24px]"/>
        </div>
        <h1 className="text-[40px] mb-2 font-bold">Hourly Data</h1>
      </div>
    </div>
  );
}