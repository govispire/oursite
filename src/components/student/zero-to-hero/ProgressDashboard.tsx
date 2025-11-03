import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Trophy } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const ProgressDashboard = () => {
  const { journeyState } = useZeroToHero();

  const totalDays = journeyState.goalDuration || 30;
  const completedDays = journeyState.completedDays.length;
  const overallProgress = (completedDays / totalDays) * 100;

  const stats = [
    {
      title: 'Completion Rate',
      value: `${Math.round(overallProgress)}%`,
      icon: Target,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Current Streak',
      value: `${journeyState.streak} 🔥`,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Days Completed',
      value: `${completedDays}/${totalDays}`,
      icon: Clock,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Accuracy',
      value: `${journeyState.totalAccuracy}%`,
      icon: Trophy,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <StatIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Journey Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={overallProgress} className="h-4" />
          <p className="text-sm text-gray-600">
            {completedDays} days completed out of {totalDays} days
          </p>
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {journeyState.selectedSubjects.map((subject) => {
            const subjectProgress = Math.floor(Math.random() * 40) + 60;
            return (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{subject}</span>
                  <span className="text-gray-600">{subjectProgress}%</span>
                </div>
                <Progress value={subjectProgress} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weak Areas Improvement */}
      <Card>
        <CardHeader>
          <CardTitle>Weak Areas Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyState.weakAreas.map((area) => (
              <div key={area.subject} className="space-y-3">
                <h4 className="font-semibold text-gray-900">{area.subject}</h4>
                {area.topics.map((topic) => {
                  const improvement = Math.floor(Math.random() * 30) + 40;
                  return (
                    <div key={topic} className="ml-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{topic}</span>
                        <span className="text-green-600">+{improvement}% ↑</span>
                      </div>
                      <Progress value={improvement + 30} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            "Success is the sum of small efforts repeated day in and day out."
          </p>
          <p className="text-sm text-gray-600">Keep pushing forward! 💪</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
