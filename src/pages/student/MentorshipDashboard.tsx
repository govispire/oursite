
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  MessageSquare,
  Video,
  Heart,
  Clock,
  Star,
  Trophy
} from 'lucide-react';
import YourMentorsPage from '@/components/student/mentorship/YourMentorsPage';
import SuccessStoriesPage from '@/components/student/mentorship/SuccessStoriesPage';
import FindMentorsPage from '@/components/student/mentorship/FindMentorsPage';
import { enhancedMentors } from '@/data/enhancedMentorshipData';

const MentorshipDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats for dashboard
  const stats = [
    { icon: BookOpen, label: 'Active Programs', value: '12', color: 'text-blue-600' },
    { icon: Target, label: 'Success Rate', value: '89%', color: 'text-green-600' },
    { icon: Users, label: 'Total Students', value: '2.4K', color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Growth Rate', value: '+24%', color: 'text-orange-600' }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'session',
      content: 'Completed session with Dr. Rajesh Kumar',
      timestamp: '2 hours ago',
      isUnread: false
    },
    {
      id: 2,
      type: 'message',
      content: 'New message from Priya Sharma',
      timestamp: '4 hours ago',
      isUnread: true
    },
    {
      id: 3,
      type: 'progress',
      content: 'Weekly target achieved',
      timestamp: '1 day ago',
      isUnread: false
    }
  ];

  // Active mentors from enhanced data
  const activeMentors = enhancedMentors.filter(mentor => mentor.status === 'active');

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Mentorship Journey!</h1>
        <p className="text-blue-100">Track your progress and connect with expert mentors</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Mentors Quick View */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Active Mentors</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('your-mentors')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {activeMentors.slice(0, 3).map((mentor) => (
              <div key={mentor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{mentor.name}</h4>
                    <p className="text-xs text-gray-600">{mentor.progress.progressPercentage}% complete</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button size="sm" className="h-8 w-8 p-0">
                    <Video className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.isUnread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab('find-mentors')}>
            <Users className="h-6 w-6" />
            <span className="text-sm">Find Mentors</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Schedule Session</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab('success-stories')}>
            <Trophy className="h-6 w-6" />
            <span className="text-sm">Success Stories</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm">View Progress</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full px-4 lg:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Center</h1>
        <p className="text-gray-600">Your personalized learning and mentorship hub</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="your-mentors" className="text-xs sm:text-sm">Your Mentors</TabsTrigger>
          <TabsTrigger value="find-mentors" className="text-xs sm:text-sm">Find Mentors</TabsTrigger>
          <TabsTrigger value="success-stories" className="text-xs sm:text-sm">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="your-mentors">
          <YourMentorsPage />
        </TabsContent>

        <TabsContent value="find-mentors">
          <FindMentorsPage />
        </TabsContent>

        <TabsContent value="success-stories">
          <SuccessStoriesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipDashboard;
