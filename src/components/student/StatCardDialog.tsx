import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, Award, FileCheck, Clock, BarChart, Grid3X3, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { addDays, format, startOfWeek } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatCardDialogProps {
  type: 'journey' | 'hours' | 'active' | 'tests';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StatCardDialog = ({ type, open, onOpenChange }: StatCardDialogProps) => {
  const [viewType, setViewType] = useState<'heatmap' | 'calendar'>('heatmap');

  // Generate study data for a specific year
  const generateStudyDataForYear = (year: number) => {
    const data: Record<string, number> = {};
    const startDate = new Date(year, 0, 1);
    const endDate = year === new Date().getFullYear() ? new Date() : new Date(year, 11, 31);
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const random = Math.random();
      let minutes = 0;
      
      if (random > 0.9) {
        minutes = Math.floor(Math.random() * 120) + 600;
      } else if (random > 0.75) {
        minutes = Math.floor(Math.random() * 300) + 300;
      } else if (random > 0.5) {
        minutes = Math.floor(Math.random() * 120) + 240;
      } else if (random > 0.3) {
        minutes = Math.floor(Math.random() * 120) + 120;
      } else if (random > 0.1) {
        minutes = Math.floor(Math.random() * 120);
      }
      
      data[formattedDate] = minutes;
    }
    
    return data;
  };

  // Get color based on study minutes
  const getColor = (minutes: number): string => {
    if (minutes === 0) return 'bg-gray-100 border border-gray-200';
    if (minutes < 120) return 'bg-green-100 border border-green-200';
    if (minutes < 240) return 'bg-green-200 border border-green-300';
    if (minutes < 300) return 'bg-green-400 border border-green-500';
    if (minutes < 600) return 'bg-green-600 border border-green-700';
    return 'bg-pink-500 border border-pink-600';
  };

  // Format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  };

  // Generate calendar for a specific year
  const generateCalendarForYear = (year: number, studyData: Record<string, number>) => {
    const months = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const endMonth = year === currentYear ? today.getMonth() : 11;
    
    for (let month = 0; month <= endMonth; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      const weeks = [];
      let currentDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      
      while (currentDate <= monthEnd || currentDate.getMonth() === monthStart.getMonth()) {
        const days = [];
        
        for (let i = 0; i < 7; i++) {
          const day = addDays(currentDate, i);
          const dateKey = format(day, 'yyyy-MM-dd');
          const minutes = studyData[dateKey] || 0;
          
          days.push({
            date: day,
            dateKey,
            minutes,
            dayOfWeek: format(day, 'EEE'),
            dayOfMonth: format(day, 'd'),
            isCurrentMonth: day.getMonth() === monthStart.getMonth(),
            isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          });
        }
        
        weeks.push(days);
        currentDate = addDays(currentDate, 7);
        
        if (currentDate > monthEnd && weeks.length > 0) break;
      }
      
      months.push({
        monthName: format(monthStart, 'MMM'),
        fullMonthName: format(monthStart, 'MMMM yyyy'),
        weeks
      });
    }
    
    return months;
  };

  // Render heatmap cell
  const renderHeatmapCell = (day: any, key: string) => (
    <TooltipProvider key={key}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`w-3 h-3 rounded-sm cursor-pointer transition-all
              ${day.isCurrentMonth 
                ? `${getColor(day.minutes)} hover:ring-1 hover:ring-blue-400` 
                : 'bg-transparent'
              }
              ${day.isToday ? 'ring-1 ring-blue-500' : ''}
            `}
          />
        </TooltipTrigger>
        {day.isCurrentMonth && (
          <TooltipContent>
            <div className="text-xs">
              <p className="font-semibold">{format(day.date, 'EEEE, MMMM d, yyyy')}</p>
              {day.minutes > 0 
                ? <p>{formatTime(day.minutes)} of study</p>
                : <p>No study activity</p>
              }
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  // Render calendar cell
  const renderCalendarCell = (day: any, key: string) => (
    <TooltipProvider key={key}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`w-3 h-3 rounded-sm cursor-pointer transition-all flex items-center justify-center border text-[8px] leading-none
              ${day.isCurrentMonth 
                ? `${getColor(day.minutes)} hover:ring-1 hover:ring-blue-400` 
                : 'bg-transparent text-gray-300'
              }
              ${day.isToday ? 'ring-1 ring-blue-500' : ''}
              ${day.minutes > 0 ? 'text-white font-bold' : 'text-gray-700'}
            `}
          >
            {day.isCurrentMonth ? day.dayOfMonth : ''}
          </div>
        </TooltipTrigger>
        {day.isCurrentMonth && (
          <TooltipContent>
            <div className="text-xs">
              <p className="font-semibold">{format(day.date, 'EEEE, MMMM d, yyyy')}</p>
              {day.minutes > 0 
                ? <p>{formatTime(day.minutes)} of study</p>
                : <p>No study activity</p>
              }
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  // Render year heatmap
  const renderYearHeatmap = (year: number) => {
    const studyData = generateStudyDataForYear(year);
    const monthsData = generateCalendarForYear(year, studyData);
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Calculate statistics
    const allDays = monthsData.flatMap(month => month.weeks.flatMap(week => week));
    const studyDays = allDays.filter(day => day.minutes > 0 && day.isCurrentMonth).length;
    const totalHours = allDays.filter(day => day.isCurrentMonth).reduce((sum, day) => sum + day.minutes, 0) / 60;
    const averagePerDay = totalHours / allDays.filter(day => day.isCurrentMonth).length;

    return (
      <Card key={year} className="p-4 w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-green-600" />
            <h3 className="font-medium text-base">Study Activity - {year}</h3>
            {year === new Date().getFullYear() && (
              <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Current
              </span>
            )}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="flex gap-4 mb-3 text-xs">
          <div>
            <span className="text-gray-600 font-medium">{studyDays}</span>
            <span className="ml-1 text-gray-500">study days</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">{totalHours.toFixed(1)}h</span>
            <span className="ml-1 text-gray-500">total</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">{averagePerDay.toFixed(1)}h</span>
            <span className="ml-1 text-gray-500">avg/day</span>
          </div>
        </div>
        
        {/* Calendar Container */}
        <div className="mb-3 overflow-hidden">
          <div className="flex gap-1">
            {/* Weekday labels column */}
            <div className="flex flex-col flex-shrink-0">
              <div className="h-6 mb-1"></div>
              <div className="space-y-1">
                {dayLabels.map((day, idx) => (
                  <div key={idx} className="w-3 h-3 flex items-center justify-center text-[10px] text-gray-500 font-medium">
                    {day.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Calendar grid */}
            <div className="flex-1 min-w-0 overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-2">
                {monthsData.map((monthData, monthIndex) => (
                  <div key={monthIndex} className="flex flex-col flex-shrink-0">
                    <div className="h-6 mb-1 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-gray-700 text-center whitespace-nowrap">
                        {monthData.monthName}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                        <div key={dayIndex} className="flex gap-1">
                          {monthData.weeks.map((week, weekIndex) => {
                            const day = week[dayIndex];
                            if (!day) return <div key={weekIndex} className="w-3 h-3"></div>;
                            
                            return viewType === 'heatmap' 
                              ? renderHeatmapCell(day, `${year}-${monthIndex}-${weekIndex}-${dayIndex}`)
                              : renderCalendarCell(day, `${year}-${monthIndex}-${weekIndex}-${dayIndex}`);
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Time range labels */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>Jan</span>
          <span>Dec</span>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-gray-600">Less</div>
            <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-200 border border-green-300"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400 border border-green-500"></div>
            <div className="w-3 h-3 rounded-sm bg-green-600 border border-green-700"></div>
            <div className="w-3 h-3 rounded-sm bg-pink-500 border border-pink-600"></div>
            <div className="text-xs font-medium text-gray-600">More</div>
          </div>
        </div>
      </Card>
    );
  };

  // Streak badges data
  const streakBadges = [
    { name: 'Novice', days: 7, color: 'bg-gray-400', achieved: true },
    { name: 'Learner', days: 14, color: 'bg-blue-400', achieved: true },
    { name: 'Dedicated', days: 30, color: 'bg-green-400', achieved: true },
    { name: 'Champion', days: 50, color: 'bg-purple-400', achieved: true },
    { name: 'Maverick', days: 67, color: 'bg-orange-400', achieved: true },
    { name: 'Legend', days: 100, color: 'bg-red-400', achieved: false },
    { name: 'Master', days: 150, color: 'bg-yellow-400', achieved: false },
  ];

  // Mock test history data
  const mockTestHistory = [
    { id: 1, name: 'IBPS PO Prelims Mock Test 1', date: '2025-04-28', score: 85, total: 100 },
    { id: 2, name: 'SSC CGL General Awareness', date: '2025-04-26', score: 72, total: 100 },
    { id: 3, name: 'Banking Awareness Quiz', date: '2025-04-25', score: 90, total: 100 },
    { id: 4, name: 'Quantitative Aptitude Test', date: '2025-04-23', score: 78, total: 100 },
    { id: 5, name: 'English Comprehension', date: '2025-04-20', score: 88, total: 100 },
    { id: 6, name: 'Reasoning Section Test', date: '2025-04-18', score: 82, total: 100 },
    { id: 7, name: 'Current Affairs Weekly', date: '2025-04-15', score: 95, total: 100 },
    { id: 8, name: 'IBPS PO Mains Mock', date: '2025-04-12', score: 80, total: 100 },
  ];

  // Study hours breakdown
  const studyHoursData = [
    { month: 'Jan 2025', hours: 45, days: 20 },
    { month: 'Feb 2025', hours: 52, days: 22 },
    { month: 'Mar 2025', hours: 48, days: 19 },
    { month: 'Apr 2025', hours: 38, days: 15 },
    { month: 'May 2025', hours: 12, days: 5 },
  ];

  const renderContent = () => {
    switch (type) {
      case 'journey':
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear - 1, currentYear - 2]; // 2025, 2024, 2023
        
        return (
          <div className="space-y-4">
            {/* View Type Toggle */}
            <div className="flex justify-end">
              <div className="flex rounded-md bg-gray-100 p-0.5">
                <Button
                  variant={viewType === 'heatmap' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('heatmap')}
                  className="px-2 py-1 h-7 text-xs"
                >
                  <Grid3X3 className="h-3 w-3 mr-1" />
                  Heatmap
                </Button>
                <Button
                  variant={viewType === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('calendar')}
                  className="px-2 py-1 h-7 text-xs"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Calendar
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="space-y-6 pr-4">
                {years.map((year) => renderYearHeatmap(year))}
              </div>
            </ScrollArea>
          </div>
        );

      case 'active':
        return (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Your Active Days Streak</h3>
                <p className="text-sm text-gray-600">Keep your streak going! Current streak: 67 days</p>
              </div>

              <Card className="p-4 bg-gradient-to-r from-orange-400 to-red-400 text-white">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">67</div>
                  <div className="text-sm">Current Streak</div>
                  <div className="mt-3 text-xs opacity-90">🔥 You're on fire! Keep it up!</div>
                </div>
              </Card>

              <div>
                <h4 className="font-semibold mb-4">Streak Badges</h4>
                <div className="grid grid-cols-2 gap-3">
                  {streakBadges.map((badge) => (
                    <Card
                      key={badge.name}
                      className={`p-4 ${badge.achieved ? 'opacity-100' : 'opacity-40'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center`}>
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-xs text-gray-600">{badge.days} days</div>
                          {badge.achieved && (
                            <div className="text-xs text-green-600 font-medium">✓ Achieved</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Next Milestone</h4>
                <p className="text-sm text-gray-600">Legend Badge - 33 days to go!</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      case 'tests':
        return (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Mock Test History</h3>
                <p className="text-sm text-gray-600">All your completed mock tests and their scores</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">40</div>
                  <div className="text-xs text-gray-600">Total Tests</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">83%</div>
                  <div className="text-xs text-gray-600">Avg Score</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">32</div>
                  <div className="text-xs text-gray-600">This Month</div>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Recent Tests</h4>
                {mockTestHistory.map((test) => (
                  <Card key={test.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{test.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          test.score >= 85 ? 'text-green-600' :
                          test.score >= 70 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {test.score}/{test.total}
                        </div>
                        <div className="text-xs text-gray-600">{test.score}%</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        );

      case 'hours':
        return (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Study Hours Breakdown</h3>
                <p className="text-sm text-gray-600">Your accumulated study hours over time</p>
              </div>

              <Card className="p-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-white">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">195</div>
                  <div className="text-sm">Total Study Hours</div>
                  <div className="mt-3 text-xs opacity-90">Since January 2025</div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">6.2</div>
                  <div className="text-xs text-gray-600">Hours Today</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">38</div>
                  <div className="text-xs text-gray-600">Hours This Week</div>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Monthly Breakdown</h4>
                {studyHoursData.map((data, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{data.month}</div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{data.hours}h</div>
                        <div className="text-xs text-gray-600">{data.days} days active</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400"
                        style={{ width: `${(data.hours / 52) * 100}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Average Study Time</h4>
                <div className="text-2xl font-bold text-gray-900">3.2 hours/day</div>
                <p className="text-xs text-gray-600 mt-1">Based on active days</p>
              </div>
            </div>
          </ScrollArea>
        );
    }
  };

  const titles = {
    journey: 'Total Journey Days',
    hours: 'Total Study Hours',
    active: 'Total Active Days',
    tests: 'Total Mock Tests'
  };

  const icons = {
    journey: Calendar,
    hours: Clock,
    active: Award,
    tests: FileCheck
  };

  const Icon = icons[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {titles[type]}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default StatCardDialog;
