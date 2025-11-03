import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, GraduationCap, DollarSign, TrendingUp, Award, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExamCategorySelection } from '@/hooks/useExamCategorySelection';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StudentProfileCardProps {
  className?: string;
}

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  examCategory: string;
  customExamCategory?: string;
  targetExam: string;
  customTargetExam?: string;
  preparationStartDate: Date | null;
  state: string;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();
  const { clearSelection } = useExamCategorySelection();
  const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  const handleChangeExamCategory = () => {
    console.log('Clearing exam category selection from profile card...');
    clearSelection();
    // Navigate with state to indicate this is coming from profile
    navigate('/student/exam-categories', { state: { fromProfile: true } });
  };

  // Sample student data
  const studentData = {
    name: "Priya Singh",
    dateOfBirth: "12 March 1998",
    email: userProfile?.email || "priya.singh@example.com",
    phone: userProfile?.phone || "+91 9876543210",
    location: "Chennai, Tamil Nadu",
    startDate: "15 August 2024",
    category: userProfile?.examCategory === 'others' ? userProfile?.customExamCategory : "Banking & Insurance",
    exams: userProfile?.targetExam === 'others' ? [userProfile?.customTargetExam || "Custom Exam"] : ["IBPS PO", "SBI PO", "RBI Assistant"],
    stats: {
      studyHours: 347,
      examsApplied: 5,
      examsCleared: 3,
      prelims: 3,
      mains: 2,
      interviews: 1,
      amountSpent: 12500,
      daysStudied: 78,
      tasksCompleted: 245,
      rank: "457 / 47,657"
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center h-full w-full text-lg">
              {studentData.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{studentData.name}</h2>
            <p className="text-sm text-gray-600">
              {studentData.category} Aspirant • Started {studentData.startDate}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none bg-gray-50">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="exams">Exam Progress</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="personal" className="m-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium">{studentData.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{studentData.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium truncate">{studentData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium">{studentData.phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Current Exam Category</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {studentData.category}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleChangeExamCategory}
                      className="text-xs h-7"
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Change
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Target Exams</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {studentData.exams.map((exam, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exams" className="m-0">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-green-50 rounded-md text-center">
                    <p className="text-xs text-gray-500">Exams Applied</p>
                    <p className="text-xl font-semibold text-green-600">{studentData.stats.examsApplied}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-md text-center">
                    <p className="text-xs text-gray-500">Exams Cleared</p>
                    <p className="text-xl font-semibold text-blue-600">{studentData.stats.examsCleared}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-md text-center">
                    <p className="text-xs text-gray-500">Interviews</p>
                    <p className="text-xl font-semibold text-purple-600">{studentData.stats.interviews}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm">Prelims Cleared</span>
                    <span className="font-semibold">{studentData.stats.prelims}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm">Mains Cleared</span>
                    <span className="font-semibold">{studentData.stats.mains}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm">Amount Spent</span>
                    <span className="font-semibold">₹{studentData.stats.amountSpent}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Exam Journey
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="m-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Days Studied</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{studentData.stats.daysStudied}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-md">
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Tasks Completed</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{studentData.stats.tasksCompleted}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-yellow-50 rounded-md">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Award className="h-4 w-4" />
                      <span className="text-xs font-medium">Current Rank</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{studentData.stats.rank}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-2 text-purple-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-medium">Spent (₹)</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{studentData.stats.amountSpent}</p>
                  </div>
                </div>
                
                <div className="p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs font-medium">Study Journey</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: "60%" }} 
                      ></div>
                    </div>
                    <span className="text-xs ml-2">60%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
