import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipProps } from 'recharts';
import dayjs from 'dayjs';
import ExpandAnalytics from './ExpandAnalytics';

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


// Custom tooltip that renders via portal to body
const PortalTooltip = ({ active, payload, label, coordinate, chartId }: any) => {
  if (!active || !payload || !payload.length || !coordinate) return null;

  // Get the specific chart container position to calculate absolute screen coordinates
  const allChartWrappers = document.querySelectorAll('.recharts-wrapper');
  let chartWrapper = null;
  
  if (chartId === 'line') {
    chartWrapper = allChartWrappers[0]; // First chart is line chart
  } else if (chartId === 'bar') {
    chartWrapper = allChartWrappers[1]; // Second chart is bar chart
  }
  
  let screenX = coordinate.x;
  let screenY = coordinate.y;
  
  if (chartWrapper) {
    const rect = chartWrapper.getBoundingClientRect();
    screenX = rect.left + coordinate.x;
    screenY = rect.top + coordinate.y;
  }

  const tooltipContent = (
    <div 
      className="fixed bg-white border border-gray-300 rounded-[4px] p-[12px] px-[16px] shadow-lg pointer-events-none"
      style={{ 
        left: `${screenX - 340}px`,
        top: `${screenY - 20}px`,
        zIndex: 999999,
        transform: 'translateY(-50%)'
      }}
    >
      <p className="text-[12px] font-semibold mb-[4px] text-gray-700">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-[12px] text-black">
          <span style={{ color: entry.color, marginRight: '8px', fontSize: '16px' }}>●</span>
          <span className="text-black">{entry.name}:</span>{' '}
          <span style={{ fontWeight: 'bold'}}>
            {entry.value} hrs
          </span>
        </p>
      ))}
    </div>
  );

  return createPortal(tooltipContent, document.body);
}

export default function Analytics() {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const [trendData, setTrendData] = useState<WeeklyTrendData[]>([]);
  const [breakdownData, setBreakdownData] = useState<WeeklyBreakdownData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);

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

  // Get subjects sorted by total hours (most hours first = bottom of stack)
  const sortedSubjectsForStack = () => {
    const subjectTotals = new Map<string, { total: number; color: string }>();
    
    breakdownData.forEach(item => {
      const existing = subjectTotals.get(item.subject) || { total: 0, color: item.color };
      existing.total += item.hours;
      subjectTotals.set(item.subject, existing);
    });

    return Array.from(subjectTotals.entries())
      .sort((a, b) => b[1].total - a[1].total) // Descending order (most hours first)
      .map(([name, data]) => ({ name, color: data.color }));
  };

  // Get subject color map for tooltip
  const getSubjectColorMap = () => {
    const colorMap = new Map<string, string>();
    [...trendData, ...breakdownData].forEach(item => {
      colorMap.set(item.subject, item.color);
    });
    return colorMap;
  };

  const formatWeekLabel = (dateStr: string) => {
    const date = dayjs(dateStr);
    return `${date.month() + 1}/${date.date()}`;
  };

  return (
    <>
      <div
        className={`fixed top-[36px] right-0 z-[9999] flex flex-row transition-transform duration-700 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-[380px]'
        }`}
      >
      {/* Tall vertical bar with chevron */}
      <div 
        className="mt-[84px] w-[40px] h-[calc(100vh-80px)] flex-shrink-0 bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight className="w-[24px] h-[24px]" />
        ) : (
          <ChevronLeft className="w-[24px] h-[24px]" />
        )}
      </div>

      {/* Analytics panel */}
        <div
          className="w-[380px] h-[calc(100vh-40px)] flex-shrink-0 bg-gray-100 p-[20px] py-[15px] overflow-y-auto"
        >
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
                <h3 className="text-[16px] font-semibold mb-[10px]">Hourly Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={lineChartData()}
                    margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                    onMouseMove={(state) => setHoveredWeek(state.activeLabel != null ? String(state.activeLabel) : null)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" style={{ fontSize: '12px' }} padding={{ left: 20, right: 20 }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip content={(props: TooltipProps<number, string>) => <PortalTooltip {...props} subjectColors={getSubjectColorMap()} chartId="line" />} />
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
                    <Tooltip content={(props: TooltipProps<number, string>) => <PortalTooltip {...props} subjectColors={getSubjectColorMap()} chartId="bar" />} />
                    {sortedSubjectsForStack().map((subject) => (
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

              <div 
                onClick={() => setIsExpandedOpen(true)}
                className="flex flex-row items-center justify-center border border-[2px] border-solid border-[#777777] p-[10px] text-center bg-white cursor-pointer mt-[12px] font-bold shadow-[5px_3px_3px_rgba(0,0,0,0.1)] rounded-[4px] hover:bg-gray-100"
              >
                <Expand className="w-[20px] h-[20px] mr-[8px]" />
                <p>Expand Analytics</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expanded Analytics Modal */}
      <ExpandAnalytics isOpen={isExpandedOpen} onClose={() => setIsExpandedOpen(false)} />
    </>
  );
}