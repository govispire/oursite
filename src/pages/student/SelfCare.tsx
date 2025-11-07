
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FilePlus2, FileText, CheckSquare, User, IndianRupee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSelfCareExams } from '@/hooks/useSelfCareExams';
import { ExamForm } from '@/components/student/selfcare/ExamForm';
import { ExamCard } from '@/components/student/selfcare/ExamCard';
import { ExamTableView } from '@/components/student/selfcare/ExamTableView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SelfCare = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [showAddExamDialog, setShowAddExamDialog] = useState(false);
  const { exams, archivedExams, addExam, updateExam, deleteExam, archiveExam, updateStage, getMetrics } = useSelfCareExams();
  
  const examMetrics = getMetrics();
  const allExams = [...exams, ...archivedExams];
  
  const handleAddExam = (data: any) => {
    addExam(data);
    setShowAddExamDialog(false);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold">Self-Care (Exam Tracker)</h1>
        <p className="text-sm sm:text-base text-gray-500">Track your real exam applications and progress</p>
      </div>
      
      {/* Compact Progress Cards - Single Line */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('exams')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-blue-600 truncate">Total Exams</p>
                <h3 className="text-xl font-bold text-blue-700">{examMetrics.totalApplied}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
                <CheckSquare className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-green-600 truncate">Prelims</p>
                <h3 className="text-xl font-bold text-green-700">{examMetrics.totalPrelimsCleared}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-lg shrink-0">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-purple-600 truncate">Mains</p>
                <h3 className="text-xl font-bold text-purple-700">{examMetrics.totalMainsCleared}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-orange-600 truncate">Interviews</p>
                <h3 className="text-xl font-bold text-orange-700">{examMetrics.totalInterviewsAttended}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-100 rounded-lg shrink-0">
                <IndianRupee className="h-4 w-4 text-pink-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-pink-600 truncate">Total Spent</p>
                <h3 className="text-xl font-bold text-pink-700">₹{examMetrics.totalAmountSpent}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <CardTitle className="text-lg sm:text-xl">Exam Applications</CardTitle>
            <Button 
              className="w-full md:w-auto text-sm"
              onClick={() => setShowAddExamDialog(true)}
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exams" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exams" className="text-xs sm:text-sm">Current Applications</TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm">Exam History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exams" className="mt-4">
              <div className="space-y-3">
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <ExamCard 
                      key={exam.id}
                      exam={exam}
                      onUpdate={updateExam}
                      onDelete={deleteExam}
                      onArchive={archiveExam}
                      onUpdateStage={updateStage}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Applications</h3>
                      <p className="text-gray-500 mb-4">You haven't added any exam applications yet.</p>
                      <Button onClick={() => setShowAddExamDialog(true)}>
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Add Your First Exam
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <ExamTableView exams={allExams} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showAddExamDialog} onOpenChange={setShowAddExamDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Exam</DialogTitle>
          </DialogHeader>
          <ExamForm 
            onSubmit={handleAddExam}
            onCancel={() => setShowAddExamDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfCare;
