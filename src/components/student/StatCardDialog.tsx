import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, Award, FileCheck, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StatCardDialogProps {
  type: 'journey' | 'hours' | 'active' | 'tests';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StatCardDialog = ({ type, open, onOpenChange }: StatCardDialogProps) => {
  // Generate year-wise heatmap data from 2020 to current year
  const generateYearlyHeatmap = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = startYear; year <= currentYear; year++) {
      const months = [];
      const endMonth = year === currentYear ? new Date().getMonth() : 11;
      
      for (let month = 0; month <= endMonth; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
          // Random activity level (0-4) for demo
          const level = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
          days.push({ day, level });
        }
        months.push({ month, days });
      }
      years.push({ year, months });
    }
    return years;
  };

  const yearlyData = generateYearlyHeatmap();

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
        return (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Your Journey Timeline</h3>
                <p className="text-sm text-gray-600">Activity heatmap showing your engagement from January 2020 to present</p>
              </div>
              
              {yearlyData.map((yearData) => (
                <div key={yearData.year} className="space-y-3">
                  <h4 className="font-bold text-lg text-gray-900">{yearData.year}</h4>
                  <div className="space-y-4">
                    {yearData.months.map((monthData) => {
                      const monthName = new Date(yearData.year, monthData.month).toLocaleString('default', { month: 'short' });
                      return (
                        <div key={monthData.month}>
                          <div className="text-xs font-medium text-gray-600 mb-1">{monthName}</div>
                          <div className="flex flex-wrap gap-1">
                            {monthData.days.map((dayData) => (
                              <div
                                key={dayData.day}
                                className={`w-3 h-3 rounded-sm ${
                                  dayData.level === 0 ? 'bg-gray-100' :
                                  dayData.level === 1 ? 'bg-green-200' :
                                  dayData.level === 2 ? 'bg-green-400' :
                                  dayData.level === 3 ? 'bg-green-600' :
                                  'bg-green-800'
                                }`}
                                title={`${monthName} ${dayData.day}, ${yearData.year}`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-4 text-xs text-gray-600 pt-4 border-t">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm" />
                  <div className="w-3 h-3 bg-green-200 rounded-sm" />
                  <div className="w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="w-3 h-3 bg-green-600 rounded-sm" />
                  <div className="w-3 h-3 bg-green-800 rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </div>
          </ScrollArea>
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
