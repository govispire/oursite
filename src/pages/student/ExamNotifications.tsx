
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CategorySelector } from '@/components/global/CategorySelector';
import { ActiveCategoryFilters } from '@/components/global/ActiveCategoryFilters';
import { useCategoryFilteredExamNotifications } from '@/hooks/useCategoryFilteredContent';
import { toast } from '@/hooks/use-toast';
import ExamApplicationDialog from '@/components/student/ExamApplicationDialog';
import { 
  Calendar, 
  Clock, 
  Bell, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  ExternalLink,
  Download,
  CheckCircle,
  Eye
} from 'lucide-react';
import type { ExamNotification } from '@/data/examNotificationData';

const ExamNotifications = () => {
  const { examNotifications, stats, hasFilters, selectedCategories } = useCategoryFilteredExamNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    examName: string;
    actionType: 'notification' | 'apply' | 'result';
    url: string;
  }>({
    isOpen: false,
    examName: '',
    actionType: 'notification',
    url: ''
  });

  const getFilteredNotifications = () => {
    if (activeTab === 'all') return examNotifications;
    if (activeTab === 'upcoming') return examNotifications.filter(exam => exam.isUpcoming);
    if (activeTab === 'new') return examNotifications.filter(exam => exam.notificationStatus === 'new');
    return examNotifications;
  };

  const filteredNotifications = getFilteredNotifications();

  const handleExternalLink = (exam: ExamNotification, actionType: 'notification' | 'apply' | 'result') => {
    let url = '';
    
    switch (actionType) {
      case 'notification':
        url = exam.urls.notificationPdf || '';
        break;
      case 'apply':
        url = exam.urls.applicationForm || '';
        break;
      case 'result':
        url = exam.urls.resultPage || '';
        break;
    }

    if (!url) {
      toast({
        title: "Link Not Available",
        description: `The ${actionType} link for ${exam.examName} is not available yet.`,
        variant: "destructive"
      });
      return;
    }

    setDialogState({
      isOpen: true,
      examName: exam.examName,
      actionType,
      url
    });
  };

  const confirmExternalLink = () => {
    window.open(dialogState.url, '_blank', 'noopener,noreferrer');
    setDialogState(prev => ({ ...prev, isOpen: false }));
    
    // Update application status if applying
    if (dialogState.actionType === 'apply') {
      toast({
        title: "Application Started",
        description: `You've been redirected to apply for ${dialogState.examName}. Complete your application on the official website.`,
        type: "success"
      });
    }
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const getStatusBadge = (status: string, type: 'notification' | 'apply' | 'result') => {
    if (type === 'notification') {
      return status === 'new' ? (
        <Badge variant="destructive" className="text-xs">NEW</Badge>
      ) : null;
    }
    if (type === 'apply') {
      return status === 'new' ? (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">New</Badge>
      ) : status === 'applied' ? (
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Applied</Badge>
      ) : (
        <Badge variant="outline" className="text-xs">Apply</Badge>
      );
    }
    if (type === 'result') {
      return status === 'declared' ? (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Declared</Badge>
      ) : status === 'upcoming' ? (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Upcoming</Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-gray-600">Pending</Badge>
      );
    }
    return null;
  };

  const getResultButtonText = (status: string) => {
    switch (status) {
      case 'declared': return 'View Result';
      case 'upcoming': return 'Result Soon';
      case 'pending': return 'Check Result';
      default: return 'Result';
    }
  };

  const getRowBackgroundColor = (exam: any, index: number) => {
    const colors = [
      'bg-gray-50', 'bg-white', 'bg-red-50', 'bg-yellow-50', 'bg-blue-50', 'bg-green-50'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Exam Notifications</h1>
          <p className="text-gray-600 mt-1">
            {hasFilters 
              ? `Stay updated with upcoming exams for your selected categories`
              : 'Select your exam categories to see relevant exam notifications'
            }
          </p>
        </div>
        <CategorySelector />
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <ActiveCategoryFilters 
          showStats={true}
          totalItems={stats.total}
          filteredItems={filteredNotifications.length}
        />
      )}

      {/* Stats Cards */}
      {hasFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Notifications</p>
                  <p className="text-2xl font-bold">{stats.newNotifications}</p>
                </div>
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Application Open</p>
                  <p className="text-2xl font-bold">{stats.applicationOpen}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({examNotifications.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
          <TabsTrigger value="new">New ({stats.newNotifications})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {hasFilters ? 'No exam notifications found' : 'Select Your Categories'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasFilters 
                    ? `No ${activeTab === 'all' ? '' : activeTab} exam notifications match your selected categories.`
                    : 'Please select your exam categories using the Category Selector above to see relevant exam notifications.'
                  }
                </p>
                {!hasFilters && (
                  <div className="flex justify-center">
                    <CategorySelector />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-600 hover:bg-blue-600">
                        <TableHead className="text-white font-medium">S.No</TableHead>
                        <TableHead className="text-white font-medium">Exam Name</TableHead>
                        <TableHead className="text-white font-medium">Application Period</TableHead>
                        <TableHead className="text-white font-medium">Payment Last Date</TableHead>
                        <TableHead className="text-white font-medium">Notification</TableHead>
                        <TableHead className="text-white font-medium">Exam Date</TableHead>
                        <TableHead className="text-white font-medium">Apply</TableHead>
                        <TableHead className="text-white font-medium">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotifications.map((exam, index) => (
                        <TableRow key={exam.id} className={getRowBackgroundColor(exam, index)}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{exam.examName}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {exam.applicationPeriod.startDate}
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {exam.applicationPeriod.endDate}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs inline-block">
                              {exam.paymentLastDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExternalLink(exam, 'notification')}
                                className="flex items-center gap-1 text-xs"
                                disabled={!exam.urls.notificationPdf}
                              >
                                <Download className="h-3 w-3" />
                                View
                              </Button>
                              {getStatusBadge(exam.notificationStatus, 'notification')}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{exam.examDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleExternalLink(exam, 'apply')}
                                className="flex items-center gap-1 text-xs"
                                disabled={!exam.urls.applicationForm}
                              >
                                <ExternalLink className="h-3 w-3" />
                                Apply Now
                              </Button>
                              {getStatusBadge(exam.applyStatus, 'apply')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={exam.resultStatus === 'declared' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleExternalLink(exam, 'result')}
                                className="flex items-center gap-1 text-xs"
                                disabled={exam.resultStatus === 'pending' || !exam.urls.resultPage}
                              >
                                {exam.resultStatus === 'declared' ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                {getResultButtonText(exam.resultStatus)}
                              </Button>
                              {getStatusBadge(exam.resultStatus, 'result')}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <ExamApplicationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        examName={dialogState.examName}
        actionType={dialogState.actionType}
        url={dialogState.url}
        onConfirm={confirmExternalLink}
      />
    </div>
  );
};

export default ExamNotifications;
