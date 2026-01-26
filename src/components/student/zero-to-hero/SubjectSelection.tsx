import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Globe, 
  Computer,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Target
} from 'lucide-react';
import { useZeroToHero, WeakArea } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectSelection = () => {
  const { selectSubjectsAndWeakAreas, journeyState, resetJourney } = useZeroToHero();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [weakAreas, setWeakAreas] = useState<Record<string, string[]>>({});
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const subjects = [
    {
      name: 'Quantitative Aptitude',
      icon: BookOpen,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      topics: ['Number Systems', 'Percentages', 'Profit & Loss', 'Time & Work', 'Data Interpretation', 'Simplification', 'Ratio & Proportion', 'Average']
    },
    {
      name: 'Reasoning',
      icon: Brain,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      topics: ['Verbal Reasoning', 'Non-Verbal Reasoning', 'Puzzles', 'Seating Arrangement', 'Blood Relations', 'Coding-Decoding', 'Syllogism', 'Inequality']
    },
    {
      name: 'English',
      icon: MessageSquare,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Error Detection', 'Sentence Improvement', 'Cloze Test', 'Para Jumbles', 'Idioms & Phrases']
    },
    {
      name: 'General Awareness',
      icon: Globe,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      topics: ['Current Affairs', 'Banking Awareness', 'History', 'Geography', 'Economics', 'Polity', 'Science', 'Static GK']
    },
    {
      name: 'Computer',
      icon: Computer,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      topics: ['Computer Fundamentals', 'MS Office', 'Internet & Networking', 'Computer Abbreviations', 'Software & Hardware', 'Database', 'Security', 'Operating Systems']
    }
  ];

  const toggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(prev => prev.filter(s => s !== subjectName));
      setWeakAreas(prev => {
        const updated = { ...prev };
        delete updated[subjectName];
        return updated;
      });
      if (expandedSubject === subjectName) {
        setExpandedSubject(null);
      }
    } else {
      setSelectedSubjects(prev => [...prev, subjectName]);
      setExpandedSubject(subjectName);
    }
  };

  const toggleWeakTopic = (subject: string, topic: string) => {
    setWeakAreas(prev => {
      const subjectTopics = prev[subject] || [];
      const updated = subjectTopics.includes(topic)
        ? subjectTopics.filter(t => t !== topic)
        : [...subjectTopics, topic];
      return { ...prev, [subject]: updated };
    });
  };

  const getTotalTopicsSelected = () => {
    return Object.values(weakAreas).reduce((sum, topics) => sum + topics.length, 0);
  };

  const handleGeneratePathway = () => {
    const totalTopics = getTotalTopicsSelected();
    
    if (selectedSubjects.length === 0) {
      toast({
        title: 'Select Subjects',
        description: 'Please select at least one subject to continue.',
        variant: 'destructive'
      });
      return;
    }

    if (totalTopics === 0) {
      toast({
        title: 'Select Weak Topics',
        description: 'Please mark at least one weak topic in your selected subjects.',
        variant: 'destructive'
      });
      return;
    }

    const weakAreasArray: WeakArea[] = selectedSubjects
      .filter(subject => weakAreas[subject]?.length > 0)
      .map(subject => ({
        subject,
        topics: weakAreas[subject]
      }));

    selectSubjectsAndWeakAreas(selectedSubjects, weakAreasArray);
    
    toast({
      title: 'Pathway Locked! 🔐',
      description: `${journeyState.goalDuration}-day mastery journey begins now!`,
    });
  };

  const goBack = () => {
    resetJourney();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Weak Areas</h2>
            <p className="text-gray-600">Pick subjects and mark specific topics you struggle with</p>
          </div>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          {journeyState.goalDuration} Days Locked
        </Badge>
      </div>

      {/* Progress Indicator */}
      <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Topics Selected</p>
            <p className="text-sm text-gray-600">{getTotalTopicsSelected()} topics across {selectedSubjects.length} subjects</p>
          </div>
        </div>
        <Button 
          onClick={handleGeneratePathway}
          disabled={getTotalTopicsSelected() === 0}
          className="bg-primary hover:bg-primary/90"
        >
          Lock & Start
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Subject Cards */}
      <div className="space-y-3">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.name);
          const isExpanded = expandedSubject === subject.name;
          const SubjectIcon = subject.icon;
          const topicsCount = weakAreas[subject.name]?.length || 0;

          return (
            <Card 
              key={subject.name} 
              className={`transition-all overflow-hidden ${
                isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
              }`}
            >
              <CardContent className="p-0">
                {/* Subject Header */}
                <div 
                  className={`p-4 cursor-pointer flex items-center justify-between ${
                    isSelected ? subject.bgLight : 'bg-white'
                  }`}
                  onClick={() => toggleSubject(subject.name)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      id={subject.name}
                      checked={isSelected}
                      onCheckedChange={() => toggleSubject(subject.name)}
                      className="pointer-events-none"
                    />
                    <div className={`w-10 h-10 rounded-xl ${subject.color} flex items-center justify-center`}>
                      <SubjectIcon className="h-5 w-5 text-white" />
                    </div>
                    <Label htmlFor={subject.name} className="text-lg font-semibold cursor-pointer">
                      {subject.name}
                    </Label>
                  </div>
                  
                  {isSelected && topicsCount > 0 && (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                      {topicsCount} topics selected
                    </Badge>
                  )}
                </div>

                {/* Topics Grid (Expanded) */}
                <AnimatePresence>
                  {isSelected && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t"
                    >
                      <div className="p-4 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Select topics you find difficult:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {subject.topics.map((topic) => {
                            const isTopicSelected = weakAreas[subject.name]?.includes(topic);
                            return (
                              <div 
                                key={topic} 
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                  isTopicSelected 
                                    ? 'bg-primary/10 border border-primary/30' 
                                    : 'bg-white border border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => toggleWeakTopic(subject.name, topic)}
                              >
                                <Checkbox 
                                  id={`${subject.name}-${topic}`}
                                  checked={isTopicSelected}
                                  onCheckedChange={() => toggleWeakTopic(subject.name, topic)}
                                  className="pointer-events-none"
                                />
                                <Label 
                                  htmlFor={`${subject.name}-${topic}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {topic}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed View with Selected Topics */}
                {isSelected && !isExpanded && topicsCount > 0 && (
                  <div 
                    className="px-4 pb-3 cursor-pointer"
                    onClick={() => setExpandedSubject(subject.name)}
                  >
                    <div className="flex flex-wrap gap-1">
                      {weakAreas[subject.name]?.slice(0, 4).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {topicsCount > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{topicsCount - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center pt-4">
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-12 shadow-lg"
          onClick={handleGeneratePathway}
          disabled={getTotalTopicsSelected() === 0}
        >
          Lock My {journeyState.goalDuration}-Day Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SubjectSelection;
