import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Train,
  Shield,
  Landmark,
  TrendingUp,
  Users
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO, parse } from 'date-fns';

interface ExamEvent {
  id: string;
  examName: string;
  category: string;
  date: Date;
  eventType: 'application-start' | 'application-end' | 'exam' | 'admit-card' | 'result';
  status: string;
  officialLink: string;
}

interface ExamNotification {
  id: string;
  examName: string;
  category: string;
  applicationStart: string;
  applicationEnd: string;
  examDate: string;
  resultDate?: string;
  admitCardDate?: string;
  status: string;
  officialLink: string;
}

interface ExamCalendarViewProps {
  notifications: ExamNotification[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  banking: <Building2 className="h-3 w-3" />,
  ssc: <GraduationCap className="h-3 w-3" />,
  railway: <Train className="h-3 w-3" />,
  upsc: <Landmark className="h-3 w-3" />,
  defence: <Shield className="h-3 w-3" />,
  tnpsc: <GraduationCap className="h-3 w-3" />,
  regulatory: <TrendingUp className="h-3 w-3" />,
  mba: <Users className="h-3 w-3" />,
};

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  'application-start': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  'application-end': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  'exam': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'admit-card': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'result': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
};

const eventTypeLabels: Record<string, string> = {
  'application-start': 'Application Opens',
  'application-end': 'Last Date to Apply',
  'exam': 'Exam Date',
  'admit-card': 'Admit Card',
  'result': 'Result',
};

const parseDate = (dateStr: string): Date => {
  // Parse dates like "01 Jun 2025"
  return parse(dateStr, 'dd MMM yyyy', new Date());
};

const ExamCalendarView: React.FC<ExamCalendarViewProps> = ({ notifications }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert notifications to calendar events
  const events: ExamEvent[] = notifications.flatMap(notification => {
    const eventsArray: ExamEvent[] = [];
    
    eventsArray.push({
      id: `${notification.id}-app-start`,
      examName: notification.examName,
      category: notification.category,
      date: parseDate(notification.applicationStart),
      eventType: 'application-start',
      status: notification.status,
      officialLink: notification.officialLink,
    });

    eventsArray.push({
      id: `${notification.id}-app-end`,
      examName: notification.examName,
      category: notification.category,
      date: parseDate(notification.applicationEnd),
      eventType: 'application-end',
      status: notification.status,
      officialLink: notification.officialLink,
    });

    eventsArray.push({
      id: `${notification.id}-exam`,
      examName: notification.examName,
      category: notification.category,
      date: parseDate(notification.examDate),
      eventType: 'exam',
      status: notification.status,
      officialLink: notification.officialLink,
    });

    if (notification.admitCardDate) {
      eventsArray.push({
        id: `${notification.id}-admit`,
        examName: notification.examName,
        category: notification.category,
        date: parseDate(notification.admitCardDate),
        eventType: 'admit-card',
        status: notification.status,
        officialLink: notification.officialLink,
      });
    }

    if (notification.resultDate) {
      eventsArray.push({
        id: `${notification.id}-result`,
        examName: notification.examName,
        category: notification.category,
        date: parseDate(notification.resultDate),
        eventType: 'result',
        status: notification.status,
        officialLink: notification.officialLink,
      });
    }

    return eventsArray;
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day to add padding
  const startPadding = monthStart.getDay();
  const paddingDays = Array.from({ length: startPadding }, (_, i) => null);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDay(selectedDate);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get events for current month for the sidebar
  const monthEvents = events
    .filter(event => isSameMonth(event.date, currentMonth))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-6">
      {/* Calendar Grid */}
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Exam Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div 
                key={day} 
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-1 rounded-lg transition-all relative
                    ${today ? 'bg-primary/20 border-primary border' : 'hover:bg-muted/50'}
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    ${hasEvents ? 'bg-muted/30' : ''}
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${today ? 'text-primary' : 'text-foreground'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {hasEvents && (
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.eventType].text.replace('text-', 'bg-')}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="text-sm font-medium text-foreground mb-3">Event Types</div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${eventTypeColors[key].text.replace('text-', 'bg-')}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar - Events List */}
      <div className="space-y-4">
        {/* Selected Date Events */}
        {selectedDate && (
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSelectedDateEvents().length === 0 ? (
                <p className="text-muted-foreground text-sm">No events on this date</p>
              ) : (
                <div className="space-y-3">
                  {getSelectedDateEvents().map(event => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg ${eventTypeColors[event.eventType].bg} ${eventTypeColors[event.eventType].border} border`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {categoryIcons[event.category]}
                        <span className="text-xs text-muted-foreground capitalize">{event.category}</span>
                      </div>
                      <div className="font-medium text-foreground text-sm">{event.examName}</div>
                      <Badge className={`${eventTypeColors[event.eventType].bg} ${eventTypeColors[event.eventType].text} ${eventTypeColors[event.eventType].border} mt-2`}>
                        {eventTypeLabels[event.eventType]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* This Month's Events */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              This Month's Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events this month</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {monthEvents.slice(0, 15).map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDate(event.date)}
                  >
                    <div className={`p-1.5 rounded ${eventTypeColors[event.eventType].bg}`}>
                      {event.eventType === 'exam' && <FileText className={`h-3 w-3 ${eventTypeColors[event.eventType].text}`} />}
                      {event.eventType === 'application-start' && <CheckCircle className={`h-3 w-3 ${eventTypeColors[event.eventType].text}`} />}
                      {event.eventType === 'application-end' && <AlertCircle className={`h-3 w-3 ${eventTypeColors[event.eventType].text}`} />}
                      {event.eventType === 'admit-card' && <FileText className={`h-3 w-3 ${eventTypeColors[event.eventType].text}`} />}
                      {event.eventType === 'result' && <CheckCircle className={`h-3 w-3 ${eventTypeColors[event.eventType].text}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{event.examName}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(event.date, 'MMM d')} • {eventTypeLabels[event.eventType]}
                      </div>
                    </div>
                    {categoryIcons[event.category]}
                  </div>
                ))}
                {monthEvents.length > 15 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{monthEvents.length - 15} more events
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamCalendarView;
