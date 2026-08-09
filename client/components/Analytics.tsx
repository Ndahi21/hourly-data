import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyTrendData {
  weekStart: string;
  subject: string;
  color: string;
  hours: number;
}

interface WeeklyBreakdownData {
  weekStart: string;
  subject: string;
  color: string;
  hours: number;
}

export default function Analytics() {
  const [isOpen, setIsOpen] = useState(true);
  const [trendData, setTrendData] = useState<WeeklyTrendData[]>([]);
  const [breakdownData, setBreakdownData] = useState<WeeklyBreakdownData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch both analytics endpoints
        const [trendRes, breakdownRes] = await Promise.all([
          fetch('/api/analytics/weekly-trend?weeks=8'),
          fetch('/api/analytics/weekly-breakdown?weeks=8')
        ]);

        if (trendRes.ok && breakdownRes.ok) {
          const trendJson = await trendRes.json();
          const breakdownJson = await breakdownRes.json();
          
          setTrendData(trendJson.data || []);
          setBreakdownData(breakdownJson.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  // Transform data for line chart (hours per subject over weeks)
  const lineChartData = () => {
    const weekMap = new Map<string, any>();
    
    trendData.forEach(item => {
      if (!weekMap.has(item.weekStart)) {
        weekMap.set(item.weekStart, { week: formatWeekLabel(item.weekStart) });
      }
      const week = weekMap.get(item.weekStart);
      week[item.subject] = item.hours;
    });

    return Array.from(weekMap.values());
  };

  // Transform data for stacked bar chart (hours per subject per week)
  const barChartData = () => {
    const weekMap = new Map<string, any>();
    
    breakdownData.forEach(item => {
      if (!weekMap.has(item.weekStart)) {
        weekMap.set(item.weekStart, { week: formatWeekLabel(item.weekStart) });
      }
      const week = weekMap.get(item.weekStart);
      week[item.subject] = item.hours;
    });

    return Array.from(weekMap.values());
  };

  // Get unique subjects for chart legends
  const uniqueSubjects = () => {
    const subjects = new Map<string, string>();
    [...trendData, ...breakdownData].forEach(item => {
      subjects.set(item.subject, item.color);
    });
    return Array.from(subjects.entries()).map(([name, color]) => ({ name, color }));
  };

  const formatWeekLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <>
      {/* Tall vertical bar with chevron */}
      <div 
        className={`fixed top-[120px] w-[40px] h-[calc(100vh-80px)] bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center z-[999] duration-700 transition-all ${
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
        <div className="fixed top-[36px] right-0 w-[380px] h-[calc(100vh-40px)] bg-gray-100 p-[20px] py-[15px] z-[1000] overflow-y-auto">
          <div className="flex flex-row items-center mb-[12px]">
            <img src="/graph.png" className="w-[30px] h-[30px] mr-[10px] object-contain"/>
            <h2 className="text-[22px] font-bold">Analytics</h2>
          </div>

          {loading ? (
            <div className="text-center py-[40px] text-gray-600">Loading analytics...</div>
          ) : (
            <>
              {/* Line Chart - Hours Trend Over Weeks */}
              <div className="bg-white p-[15px] py-[10px] rounded-[8px] mb-[10px] shadow-sm">
                <h3 className="text-[16px] font-semibold mb-[10px]">Hourly Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {uniqueSubjects().map((subject) => (
                      <Line
                        key={subject.name}
                        type="monotone"
                        dataKey={subject.name}
                        stroke={subject.color}
                        strokeWidth={2}
                        dot={{ fill: subject.color }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stacked Bar Chart - Hours Breakdown per Week */}
              <div className="bg-white p-[15px] py-[10px] rounded-[8px] mb-[10px] shadow-sm">
                <h3 className="text-[16px] font-semibold mb-[10px]">Subject Prominence</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {uniqueSubjects().map((subject) => (
                      <Bar
                        key={subject.name}
                        dataKey={subject.name}
                        stackId="a"
                        fill={subject.color}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-row items-center justify-center border border-[2px] border-solid border-[#777777] p-[10px] text-center bg-white cursor-pointer mt-[12px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100">
                <Expand className="w-[20px] h-[20px] mr-[8px]" />
                <p>Expand Analytics</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}