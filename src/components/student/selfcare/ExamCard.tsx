
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, CheckCheck, Edit, Trash2, MapPin, IndianRupee, Trophy } from 'lucide-react';
import { ExamApplication, ExamStage } from '@/hooks/useSelfCareExams';
import { ExamForm } from './ExamForm';
import { StageProgressBar } from './StageProgressBar';

interface ExamCardProps {
  exam: ExamApplication;
  onUpdate: (id: string, updates: Partial<ExamApplication>) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onUpdateStage: (examId: string, stageIndex: number, updates: Partial<ExamStage>) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onUpdate, onDelete, onArchive, onUpdateStage }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleEdit = (data: any) => {
    onUpdate(exam.id, data);
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(exam.id);
    setShowDeleteDialog(false);
  };

  const handleArchive = () => {
    onArchive(exam.id);
    setShowArchiveDialog(false);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      case 'free': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payment Complete';
      case 'pending': return 'Payment Pending';
      case 'free': return 'No Payment Required';
      default: return status;
    }
  };

  const getFinalStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'text-green-600 bg-green-50 border-green-200';
      case 'not-selected': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFinalStatusText = (status: string) => {
    switch (status) {
      case 'selected': return 'Selected';
      case 'not-selected': return 'Not Selected';
      case 'pending': return 'In Progress';
      default: return status;
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-base sm:text-lg">{exam.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFinalStatusColor(exam.finalStatus)}`}>
                  {getFinalStatusText(exam.finalStatus)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <IndianRupee className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Fee: ₹{exam.examFeeAmount}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Exam: {new Date(exam.firstExamDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Place: {exam.placeOfExam}</span>
                </div>
                <div className={`flex items-center ${getPaymentStatusColor(exam.paymentStatus)}`}>
                  <CheckCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{getPaymentStatusText(exam.paymentStatus)}</span>
                </div>
              </div>
              {exam.notes && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{exam.notes}</p>
              )}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowArchiveDialog(true)}
                className="flex-1 md:flex-none text-xs hover:bg-green-50 text-green-600"
              >
                <Trophy className="mr-1 h-3 w-3" />
                Achieve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEditDialog(true)}
                className="flex-1 md:flex-none text-xs hover:bg-blue-50"
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDeleteDialog(true)}
                className="flex-1 md:flex-none text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <StageProgressBar 
              stages={exam.stages} 
              onStageUpdate={(stageIndex, updates) => onUpdateStage(exam.id, stageIndex, updates)}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          <ExamForm 
            onSubmit={handleEdit}
            onCancel={() => setShowEditDialog(false)}
            initialData={exam}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete "{exam.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Exam History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Move "{exam.name}" to Exam History? You've achieved this milestone!</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleArchive}>
                <Trophy className="mr-2 h-4 w-4" />
                Move to History
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
