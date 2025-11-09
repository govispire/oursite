
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Menu, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarGrid } from '@/components/student/calendar/CalendarGrid';
import { CalendarSidebar } from '@/components/student/calendar/CalendarSidebar';
import { EventDialog } from '@/components/student/calendar/EventDialog';
import { DayDetailDialog } from '@/components/student/calendar/DayDetailDialog';
import { ProgressView } from '@/components/student/calendar/ProgressView';
import { ListView } from '@/components/student/calendar/ListView';
import { CalendarEvent, CalendarDay, ViewType, eventCategories, UserRole } from '@/components/student/calendar/types';
import { useCalendarTaskManager } from '@/hooks/useCalendarTaskManager';

interface UniversalCalendarProps {
  userRole: UserRole;
  initialEvents?: CalendarEvent[];
}

const UniversalCalendar: React.FC<UniversalCalendarProps> = ({ userRole, initialEvents = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [eventFilters, setEventFilters] = useState<string[]>(['all']);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useIsMobile();

  // Use the new task manager hook
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    toggleTask, 
    getProgressStats 
  } = useCalendarTaskManager(initialEvents);

  const progressStats = getProgressStats();

  // Filter categories based on user role
  const availableCategories = eventCategories.filter(cat => 
    Array.isArray(cat.roles) && (cat.roles.includes(userRole))
  );

  // Get role-specific description
  const getRoleDescription = () => {
    switch (userRole) {
      case 'admin':
        return 'Manage system tasks and assign work to team members';
      case 'mentor':
        return 'Guide students and track their progress';
      case 'student':
        return 'Click any day to add tasks. Track your progress in real-time.';
      case 'employee':
        return 'Manage content uploads, approvals, and quality reviews';
      case 'super-admin':
        return 'Oversee system administration and platform management';
      case 'owner':
        return 'Manage business operations and strategic planning';
      case 'instructor':
        return 'Create curriculum and manage teaching activities';
      default:
        return 'Manage your schedule and track your tasks';
    }
  };

  // Generate calendar days
  const calendarDays: CalendarDay[] = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start, end });

    return days.map(date => {
      const dayEvents = events.filter(event => 
        isSameDay(event.date, date) && 
        (eventFilters.includes('all') || eventFilters.includes(event.category))
      );

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        events: dayEvents
      };
    });
  }, [currentDate, events, eventFilters, selectedDate]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(event.date, selectedDate));
  }, [events, selectedDate]);

  // Get today's events for sidebar
  const todayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(event => 
      isSameDay(event.date, selectedDate) && 
      (eventFilters.includes('all') || eventFilters.includes(event.category))
    );
  }, [events, selectedDate, eventFilters]);

  // Navigation handlers
  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Event handlers - Direct day click opens task creation
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateForEvent(date);
    setEditingEvent(null);
    setEventDialogOpen(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleAddEvent = (date: Date) => {
    setEditingEvent(null);
    setSelectedDateForEvent(date);
    setEventDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDateForEvent(event.date);
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleAddImage = (date: Date) => {
    setSelectedDateForEvent(date);
    setEventDialogOpen(true);
  };

  const handleViewDay = (date: Date) => {
    setSelectedDate(date);
    setDayDetailOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent({
        ...eventData,
        assignedBy: userRole
      });
    }
  };

  const handleToggleTask = (eventId: string) => {
    toggleTask(eventId);
  };

  const handleFilterChange = (filters: string[]) => {
    setEventFilters(filters);
  };

  const handleSidebarDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Filter events based on role, status, priority, date range, and search query
  const roleFilter: UserRole | 'all' = 'all'; // Example role filter
  const statusFilter = 'all'; // Example status filter
  const priorityFilter = 'all'; // Example priority filter
  const dateRange = { start: new Date(), end: new Date() }; // Example date range
  const searchQuery = ''; // Example search query
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(event => 
        event.assignedTo === roleFilter || event.assignedBy === roleFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(event => event.priority === priorityFilter);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(event => 
        isSameDay(event.date, dateRange.start) || 
        isSameDay(event.date, dateRange.end) || 
        (event.date >= dateRange.start && event.date <= dateRange.end)
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [events, roleFilter, statusFilter, priorityFilter, dateRange, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Calendar
            </h1>
            <p className="text-sm text-gray-600">
              {getRoleDescription()}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Mobile Filters */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Menu className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[380px] overflow-y-auto">
                  <div className="py-4">
                    <CalendarSidebar
                      selectedDate={selectedDate}
                      onDateSelect={handleSidebarDateSelect}
                      eventFilters={eventFilters}
                      onFilterChange={handleFilterChange}
                      todayEvents={todayEvents}
                      onToggleTask={handleToggleTask}
                      userRole={userRole}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Enhanced View Tabs - Removed Week/Day, Added Progress/List */}
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
              <TabsList>
                <TabsTrigger value="month">{isMobile ? 'Month' : 'Month'}</TabsTrigger>
                <TabsTrigger value="progress">{isMobile ? 'Progress' : 'Progress'}</TabsTrigger>
                <TabsTrigger value="list">{isMobile ? 'List' : 'List'}</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Quick Add Task Button */}
            <Button 
              onClick={() => handleAddEvent(selectedDate || new Date())}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Add Task</span>}
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <Card className="p-3">
            <div className="text-sm text-gray-600">Total Tasks</div>
            <div className="text-lg font-bold text-blue-600">{progressStats.total}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-lg font-bold text-green-600">{progressStats.completed}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-lg font-bold text-orange-600">{progressStats.pending}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-gray-600">Overdue</div>
            <div className="text-lg font-bold text-red-600">{progressStats.overdue}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-lg font-bold text-purple-600">{progressStats.completionRate}%</div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Event Filter Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Filters</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <CalendarSidebar
                  selectedDate={selectedDate}
                  onDateSelect={handleSidebarDateSelect}
                  eventFilters={eventFilters}
                  onFilterChange={handleFilterChange}
                  todayEvents={todayEvents}
                  onToggleTask={handleToggleTask}
                  userRole={userRole}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Calendar/Views */}
        <div className="lg:col-span-9">
          <Card>
            {viewType === 'month' && (
              <>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleToday}>
                        Today
                      </Button>
                      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CalendarGrid
                    days={calendarDays}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onAddEvent={handleAddEvent}
                    onAddImage={handleAddImage}
                    onViewDay={handleViewDay}
                  />
                </CardContent>
              </>
            )}
            
            {viewType === 'progress' && (
              <CardContent className="p-0">
                <ProgressView 
                  events={events} 
                  progressStats={progressStats}
                />
              </CardContent>
            )}
            
            {viewType === 'list' && (
              <CardContent className="p-0">
                <ListView 
                  events={events}
                  onToggleTask={handleToggleTask}
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Recent Tasks - Only show in month view */}
      {viewType === 'month' && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${eventCategories.find(cat => cat.value === event.category)?.color || 'bg-gray-400'}`} />
                      <div>
                        <div className={`font-medium ${event.completed ? 'line-through text-gray-500' : ''}`}>
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(event.date, 'MMM d')} at {event.time}
                          {event.assignedTo && event.assignedTo !== userRole && (
                            <span className="ml-2 text-blue-600">→ {event.assignedTo}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${
                        event.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                        event.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {event.priority}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">⋮</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Add Button for Mobile */}
      {isMobile && (
        <Button
          onClick={() => handleAddEvent(selectedDate || new Date())}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Dialogs */}
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        selectedDate={selectedDateForEvent}
        event={editingEvent}
        onSave={handleSaveEvent}
        userRole={userRole}
        availableCategories={availableCategories}
      />

      <DayDetailDialog
        open={dayDetailOpen}
        onOpenChange={setDayDetailOpen}
        date={selectedDate}
        events={selectedDateEvents}
        onAddTask={() => {
          setDayDetailOpen(false);
          handleAddEvent(selectedDate || new Date());
        }}
        onAddImage={() => {
          setDayDetailOpen(false);
          handleAddImage(selectedDate || new Date());
        }}
        onToggleTask={handleToggleTask}
        onEditTask={handleEditEvent}
        onDeleteTask={handleDeleteEvent}
      />
    </div>
  );
};

export default UniversalCalendar;
