import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

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

type RechartsTooltipProps = {
  active?: boolean;
  payload?: any[];
  coordinate?: { x: number; y: number };
};

const PortalTooltip = ({ active, payload, coordinate, chartId }: RechartsTooltipProps & { chartId: string }) => {
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

  return createPortal(<div>Tooltip</div>, document.body);
}

interface ExpandAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpandAnalytics({ isOpen, onClose }: ExpandAnalyticsProps) {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<WeeklyTrendData[]>([]);
  const [breakdownData, setBreakdownData] = useState<WeeklyBreakdownData[]>([]);

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

  const formatWeekLabel = (dateStr: string) => {
    const date = dayjs(dateStr);
    return `${date.month() + 1}/${date.date()}`;
  };

  return (
    <>
      {isOpen && (
      <div className="fixed inset-0 z-[10000] bg-black/35 flex items-center justify-center px-[12px]">
        <div className="fixed inset-0 bg-white z-[10000] overflow-y-auto h-[80%] w-[80%] left-[10%] top-[10%] rounded-[8px] shadow-lg border border-gray-300">
          {/* Header */}
          <div className="flex items-center justify-between p-[20px] border-b border-gray-300">
            <div className="flex items-center">
              <img src="/graph.png" className="w-[30px] h-[30px] mr-[10px] object-contain"/>
              <h2 className="text-[22px] font-bold">Analytics</h2>
            </div>
            <button
              onClick={onClose}
              className="p-[8px] hover:bg-gray-100 rounded-[4px] transition-colors"
              aria-label="Close"
            >
              <X className="w-[24px] h-[24px]" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-[40px] text-gray-600">Loading analytics...</div>
          ) : (
            <div className="flex">
              {/* Legend Sidebar - Left Side */}
              <div className="w-[220px] p-[20px] border-r border-gray-300 bg-gray-50">
                <h3 className="text-[14px] font-bold mb-[12px]">Subjects by Hours</h3>
                <div className="space-y-[6px]">
                  {sortedSubjectsForStack().map((subject) => (
                    <div key={subject.name} className="flex items-center gap-[8px]">
                      <span 
                        className="w-[16px] h-[16px] rounded-[3px] flex-shrink-0"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-[13px] text-gray-800">{subject.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Area */}
              <div className="flex-1 p-[20px]">
                {/* Line Chart - Hours Trend Over Weeks */}
                <div className="bg-white p-[20px] rounded-[8px] mb-[20px] shadow-sm border border-gray-200">
                  <h3 className="text-[18px] font-semibold mb-[16px]">Hourly Trends</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={lineChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        style={{ fontSize: '12px' }} 
                        label={{ value: 'Week Starting', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        style={{ fontSize: '12px' }} 
                        label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip content={(props: RechartsTooltipProps) => <PortalTooltip {...props} coordinate={props.coordinate} chartId="line" />} />
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
                <div className="bg-white p-[20px] rounded-[8px] shadow-sm border border-gray-200">
                  <h3 className="text-[18px] font-semibold mb-[16px]">Subject Prominence</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={barChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        style={{ fontSize: '12px' }} 
                        label={{ value: 'Week Starting', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        style={{ fontSize: '12px' }} 
                        label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip content={(props: RechartsTooltipProps) => <PortalTooltip {...props} coordinate={props.coordinate} chartId="bar" />} />
                      {sortedSubjectsForStack().map((subject) => (
                        <Bar
                          key={subject.name}
                          dataKey={subject.name}
                          stackId="a"
                          fill={subject.color}
                          barSize={60}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </>
  );
}