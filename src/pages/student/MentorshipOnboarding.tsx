import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Languages, Target, BookOpen, Layers, Brain, MessageSquare } from 'lucide-react';
import { useMentorship, OnboardingProfile } from '@/contexts/MentorshipContext';
import { findBestMentor } from '@/lib/mentorMatching';
import { LANGUAGE_LABELS, STAGE_LABELS, MentorLanguage, MentorStage } from '@/data/mentorPoolData';
import { buildDailyTasks } from '@/data/predefinedTasks';

const CATEGORIES = [
  { id: 'banking', name: 'Banking', desc: 'IBPS, SBI, RBI', icon: '🏦' },
  { id: 'ssc', name: 'SSC', desc: 'CGL, CHSL, MTS', icon: '📋' },
  { id: 'railways-rrb', name: 'Railways RRB', desc: 'NTPC, Group D', icon: '🚆' },
  { id: 'civil-services', name: 'Civil Services', desc: 'UPSC, BPSC', icon: '🏛️' },
  { id: 'tamil-nadu-exams', name: 'TNPSC', desc: 'Group 2, 4, VAO', icon: '📜' },
  { id: 'karnataka-exams', name: 'Karnataka', desc: 'KAS, PSI', icon: '🌐' },
  { id: 'regulatory', name: 'Regulatory', desc: 'RBI, NABARD, SEBI', icon: '⚖️' },
  { id: 'insurance', name: 'Insurance', desc: 'LIC, NIACL', icon: '🛡️' },
];

const TARGET_EXAMS: Record<string, string[]> = {
  banking: ['SBI Clerk', 'SBI PO', 'IBPS Clerk', 'IBPS PO', 'RBI Assistant'],
  ssc: ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC CPO', 'SSC GD'],
  'railways-rrb': ['RRB NTPC', 'RRB Group D', 'RRB ALP', 'RRB JE'],
  'civil-services': ['UPSC CSE', 'BPSC', 'UPPSC'],
  'tamil-nadu-exams': ['TNPSC Group 2', 'TNPSC Group 4', 'TNUSRB SI'],
  'karnataka-exams': ['KAS', 'PSI', 'PWD'],
  regulatory: ['RBI Grade B', 'NABARD Grade A', 'SEBI Grade A'],
  insurance: ['LIC AAO', 'NIACL Assistant', 'LIC ADO'],
};

const STAGES: { id: MentorStage; title: string; subtitle: string }[] = [
  { id: 'prelims', title: 'Prelims', subtitle: 'Speed + accuracy focused' },
  { id: 'mains', title: 'Mains', subtitle: 'Depth + descriptive prep' },
  { id: 'interview', title: 'Interview', subtitle: 'Personality + communication' },
  { id: 'overall', title: 'Overall', subtitle: 'Full-cycle guidance' },
];

const SUBJECTS_PRELIMS = ['English', 'Quantitative Aptitude', 'Reasoning', 'General Awareness'];
const SUBJECTS_MAINS = ['English', 'Quantitative Aptitude', 'Reasoning', 'General Awareness', 'Interview Syllabus'];

const LANGUAGES: MentorLanguage[] = ['english', 'hindi', 'tamil', 'malayalam', 'kannada', 'telugu'];

const STYLES = [
  { id: 'strict' as const, title: 'Strict Mode', desc: 'Strict daily follow-up & accountability' },
  { id: 'balanced' as const, title: 'Balanced Mode', desc: 'Mix of structure and flexibility' },
  { id: 'flexible' as const, title: 'Flexible Mode', desc: 'Self-paced with light check-ins' },
];

const TOTAL_STEPS = 9;

const MentorshipOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, setMentor, setTasks } = useMentorship();
  const [step, setStep] = useState(1);
  const [searchExam, setSearchExam] = useState('');
  const [profile, setProfileLocal] = useState<Partial<OnboardingProfile>>({ subjects: [] });
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<ReturnType<typeof findBestMentor> | null>(null);

  const subjectsForStage = profile.stage === 'mains' || profile.stage === 'interview' ? SUBJECTS_MAINS : SUBJECTS_PRELIMS;
  const examsForCategory = (profile.examCategory && TARGET_EXAMS[profile.examCategory]) || [];
  const filteredExams = useMemo(() => examsForCategory.filter(e => e.toLowerCase().includes(searchExam.toLowerCase())), [examsForCategory, searchExam]);

  const canNext = () => {
    switch (step) {
      case 1: return !!profile.examCategory;
      case 2: return !!profile.targetExam;
      case 3: return !!profile.stage;
      case 4: return (profile.subjects?.length || 0) > 0;
      case 5: return !!profile.language;
      case 6: return !!profile.learningStyle;
      case 7: return true;
      default: return true;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const startMatching = () => {
    setStep(8);
    setMatching(true);
    setTimeout(() => {
      const result = findBestMentor({
        language: profile.language as MentorLanguage,
        stage: profile.stage as MentorStage,
        examCategory: profile.examCategory!,
      });
      setMatchResult(result);
      if (result.mentor) {
        const fullProfile = profile as OnboardingProfile;
        setProfile(fullProfile);
        setMentor(result.mentor);
        const tasks = buildDailyTasks(fullProfile.stage, fullProfile.subjects).map(t => ({
          ...t, source: 'system' as const, completed: false, date: new Date().toISOString(),
        }));
        setTasks(tasks);
      }
      setMatching(false);
      setStep(9);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</div>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-1 rounded-none" />
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {step === 1 && (
          <StepWrapper icon={<Target className="w-5 h-5" />} title="Select Exam Category" subtitle="Pick your broad exam family.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <Card key={c.id} onClick={() => setProfileLocal(p => ({ ...p, examCategory: c.id, examCategoryName: c.name }))}
                  className={`cursor-pointer transition-all hover:shadow-md ${profile.examCategory === c.id ? 'border-primary ring-2 ring-primary/30' : ''}`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="text-3xl">{c.icon}</div>
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                    {profile.examCategory === c.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper icon={<BookOpen className="w-5 h-5" />} title="Select Target Exam" subtitle={`Within ${profile.examCategoryName}`}>
            <Input placeholder="Search exam..." value={searchExam} onChange={(e) => setSearchExam(e.target.value)} className="mb-3" />
            <div className="grid sm:grid-cols-2 gap-2">
              {filteredExams.map((e) => (
                <button key={e} onClick={() => setProfileLocal(p => ({ ...p, targetExam: e }))}
                  className={`text-left p-3 rounded-lg border transition-all ${profile.targetExam === e ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <div className="font-medium text-sm">{e}</div>
                </button>
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper icon={<Layers className="w-5 h-5" />} title="Select Stage" subtitle="Where are you in your prep?">
            <div className="grid sm:grid-cols-2 gap-3">
              {STAGES.map((s) => (
                <Card key={s.id} onClick={() => setProfileLocal(p => ({ ...p, stage: s.id }))}
                  className={`cursor-pointer transition-all ${profile.stage === s.id ? 'border-primary ring-2 ring-primary/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="font-semibold mb-1">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper icon={<Brain className="w-5 h-5" />} title="Select Subjects" subtitle="Pick subjects you want focus on">
            <div className="grid sm:grid-cols-2 gap-2">
              {subjectsForStage.map((s) => {
                const active = profile.subjects?.includes(s);
                return (
                  <button key={s} onClick={() => setProfileLocal(p => ({
                    ...p, subjects: active ? p.subjects?.filter(x => x !== s) : [...(p.subjects || []), s],
                  }))}
                    className={`text-left p-3 rounded-lg border flex items-center justify-between ${active ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <span className="text-sm font-medium">{s}</span>
                    {active && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setProfileLocal(p => ({ ...p, subjects: subjectsForStage }))}>Select all</Button>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper icon={<Languages className="w-5 h-5" />} title="Preferred Language" subtitle="Your mentor and guidance will be in this language">
            <div className="grid sm:grid-cols-3 gap-3">
              {LANGUAGES.map((l) => (
                <Card key={l} onClick={() => setProfileLocal(p => ({ ...p, language: l }))}
                  className={`cursor-pointer text-center transition-all ${profile.language === l ? 'border-primary ring-2 ring-primary/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="font-semibold">{LANGUAGE_LABELS[l]}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 6 && (
          <StepWrapper icon={<Sparkles className="w-5 h-5" />} title="Mentorship Style" subtitle="Choose how strict you want guidance">
            <div className="grid sm:grid-cols-3 gap-3">
              {STYLES.map((s) => (
                <Card key={s.id} onClick={() => setProfileLocal(p => ({ ...p, learningStyle: s.id }))}
                  className={`cursor-pointer transition-all ${profile.learningStyle === s.id ? 'border-primary ring-2 ring-primary/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="font-semibold mb-1">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 7 && (
          <StepWrapper icon={<Check className="w-5 h-5" />} title="Confirm Your Profile" subtitle="Review before mentor matching">
            <Card>
              <CardContent className="p-6 space-y-3">
                <Row label="Exam Category" value={profile.examCategoryName!} onEdit={() => setStep(1)} />
                <Row label="Target Exam" value={profile.targetExam!} onEdit={() => setStep(2)} />
                <Row label="Stage" value={STAGE_LABELS[profile.stage as MentorStage]} onEdit={() => setStep(3)} />
                <Row label="Subjects" value={profile.subjects!.join(', ')} onEdit={() => setStep(4)} />
                <Row label="Language" value={LANGUAGE_LABELS[profile.language as MentorLanguage]} onEdit={() => setStep(5)} />
                <Row label="Style" value={profile.learningStyle!} onEdit={() => setStep(6)} />
              </CardContent>
            </Card>
          </StepWrapper>
        )}

        {step === 8 && (
          <div className="py-20 text-center space-y-6">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Matching you with the best mentor…</h2>
              <p className="text-muted-foreground text-sm">Checking language · stage expertise · exam category · capacity &lt; 20</p>
            </div>
          </div>
        )}

        {step === 9 && matchResult?.mentor && (
          <div className="py-8">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/70 p-6 text-primary-foreground">
                <Badge variant="secondary" className="mb-2">Mentor Assigned</Badge>
                <h2 className="text-2xl font-bold">Meet {matchResult.mentor.name}</h2>
                <p className="text-sm opacity-90">{matchResult.reason}</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={matchResult.mentor.photo} alt={matchResult.mentor.name} className="w-20 h-20 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-lg">{matchResult.mentor.name}</div>
                    <div className="text-sm text-muted-foreground">{matchResult.mentor.bio}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <Stat label="Rating" value={`${matchResult.mentor.rating}★`} />
                  <Stat label="Experience" value={`${matchResult.mentor.yearsExperience}y`} />
                  <Stat label="Response" value={`${matchResult.mentor.responseMins}min`} />
                  <Stat label="Students" value={`${matchResult.mentor.studentsAssigned + 1}/${matchResult.mentor.capacity}`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.mentor.expertise.map(e => <Badge key={e} variant="secondary">{STAGE_LABELS[e]}</Badge>)}
                  {matchResult.mentor.languages.map(l => <Badge key={l} variant="outline">{LANGUAGE_LABELS[l]}</Badge>)}
                </div>
                <div className="grid sm:grid-cols-3 gap-2 pt-3">
                  <Button onClick={() => navigate('/student/diagnostic-tests')}><Brain className="w-4 h-4 mr-2" />Start Diagnostic</Button>
                  <Button variant="outline" onClick={() => navigate('/student/mentor-chat')}><MessageSquare className="w-4 h-4 mr-2" />Open Chat</Button>
                  <Button variant="outline" onClick={() => navigate('/student/mentorship')}>View Daily Plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 9 && !matchResult?.mentor && (
          <div className="py-20 text-center">
            <h2 className="text-xl font-bold mb-2">Added to manual queue</h2>
            <p className="text-muted-foreground">A superadmin will manually assign a mentor shortly.</p>
            <Button className="mt-4" onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
          </div>
        )}

        {step <= 7 && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={back} disabled={step === 1}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
            {step < 7 ? (
              <Button onClick={next} disabled={!canNext()}>Continue<ArrowRight className="w-4 h-4 ml-1" /></Button>
            ) : (
              <Button onClick={startMatching}><Sparkles className="w-4 h-4 mr-1" />Find My Mentor</Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const StepWrapper: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
  <div>
    <div className="mb-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string; onEdit: () => void }> = ({ label, value, onEdit }) => (
  <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium capitalize">{value}</div>
    </div>
    <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <div className="text-lg font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default MentorshipOnboarding;
