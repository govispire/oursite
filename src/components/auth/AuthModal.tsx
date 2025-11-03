import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedSelect, EnhancedSelectContent, EnhancedSelectItem, EnhancedSelectTrigger, EnhancedSelectValue } from "@/components/ui/enhanced-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, User, Shield, UserCheck, Crown, Building, CheckCircle2, FileText, Target, Eye, MessageSquare, Wrench } from "lucide-react";
import { format } from "date-fns";
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { examCategories, getExamsByCategory } from '@/data/examData';
import { indiaStates } from '@/data/indiaStates';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  activeTab: "login" | "register";
  setActiveTab: (tab: "login" | "register") => void;
  selectedExam?: string;
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

const demoAccounts = [
  {
    role: 'student',
    email: 'student@example.com',
    password: 'password123',
    name: 'Student User',
    description: 'Access student dashboard, tests, and learning resources',
    icon: User,
    color: 'bg-blue-500'
  },
  {
    role: 'mentor',
    email: 'mentor@example.com',
    password: 'password123',
    name: 'Mentor User',
    description: 'Manage students, assign tasks, and track progress',
    icon: UserCheck,
    color: 'bg-green-500'
  },
  {
    role: 'employee',
    email: 'employee@example.com',
    password: 'password123',
    name: 'Employee User',
    description: 'General employee dashboard',
    icon: Building,
    color: 'bg-purple-500'
  },
  {
    role: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    name: 'General Admin',
    description: 'Manage users, content, and system settings',
    icon: Shield,
    color: 'bg-orange-500'
  },
  {
    role: 'super-admin',
    email: 'superadmin@example.com',
    password: 'password123',
    name: 'Super Admin',
    description: 'Full system access and advanced administration',
    icon: Crown,
    color: 'bg-red-500'
  },
  {
    role: 'owner',
    email: 'owner@example.com',
    password: 'password123',
    name: 'Owner User',
    description: 'Complete platform ownership and control',
    icon: Crown,
    color: 'bg-yellow-500'
  },
];

const employeeCategoryAccounts = [
  {
    email: 'expert@example.com',
    password: 'password123',
    name: 'Subject Matter Expert',
    description: 'Create and review high-quality educational content',
    icon: Target,
    color: 'bg-indigo-600'
  },
  {
    email: 'creator@example.com',
    password: 'password123',
    name: 'Content Creator',
    description: 'Create educational materials and resources',
    icon: FileText,
    color: 'bg-emerald-600'
  },
  {
    email: 'developer@example.com',
    password: 'password123',
    name: 'Test Developer',
    description: 'Create comprehensive tests and assessments',
    icon: Target,
    color: 'bg-cyan-600'
  },
  {
    email: 'reviewer@example.com',
    password: 'password123',
    name: 'Quality Reviewer',
    description: 'Review and ensure quality of content',
    icon: Eye,
    color: 'bg-amber-600'
  },
  {
    email: 'moderator@example.com',
    password: 'password123',
    name: 'Content Moderator',
    description: 'Moderate content and maintain standards',
    icon: MessageSquare,
    color: 'bg-rose-600'
  },
  {
    email: 'support@example.com',
    password: 'password123',
    name: 'Technical Support',
    description: 'Provide technical assistance and support',
    icon: Wrench,
    color: 'bg-slate-600'
  },
];

const adminCategoryAccounts = [
  {
    email: 'admin-banking@example.com',
    password: 'password123',
    name: 'Banking Admin',
    description: 'Manage banking exams, content, and students',
    icon: Building,
    color: 'bg-blue-700'
  },
  {
    email: 'admin-ssc@example.com',
    password: 'password123',
    name: 'SSC Admin',
    description: 'Manage SSC exams and government job content',
    icon: Shield,
    color: 'bg-green-700'
  },
  {
    email: 'admin-railway@example.com',
    password: 'password123',
    name: 'Railway Admin',
    description: 'Manage railway recruitment and related content',
    icon: Crown,
    color: 'bg-purple-700'
  },
  {
    email: 'admin-upsc@example.com',
    password: 'password123',
    name: 'UPSC Admin',
    description: 'Manage civil services and UPSC content',
    icon: Shield,
    color: 'bg-red-700'
  },
  {
    email: 'admin-tnpsc@example.com',
    password: 'password123',
    name: 'TNPSC Admin',
    description: 'Manage state PSC and regional exam content',
    icon: Building,
    color: 'bg-yellow-700'
  },
  {
    email: 'admin-defence@example.com',
    password: 'password123',
    name: 'Defence Admin',
    description: 'Manage defence and military exam content',
    icon: Shield,
    color: 'bg-gray-700'
  },
  {
    email: 'admin-judicial@example.com',
    password: 'password123',
    name: 'Judicial Admin',
    description: 'Manage judicial services and law exam content',
    icon: Crown,
    color: 'bg-indigo-700'
  },
  {
    email: 'admin-regulatory@example.com',
    password: 'password123',
    name: 'Regulatory Admin',
    description: 'Manage regulatory and compliance exam content',
    icon: Building,
    color: 'bg-teal-700'
  },
];

const AuthModal = ({ activeTab, setActiveTab, selectedExam }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  
  // Enhanced registration fields
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [customExamCategory, setCustomExamCategory] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [customTargetExam, setCustomTargetExam] = useState('');
  const [preparationStartDate, setPreparationStartDate] = useState<Date | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  
  const { login, register } = useAuth();

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!username.trim()) errors.username = 'Username is required';
        if (!name.trim()) errors.name = 'Full name is required';
        if (!email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
        if (!phone.trim()) errors.phone = 'Phone number is required';
        break;
      case 2:
        if (!password) errors.password = 'Password is required';
        if (password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
        break;
      case 3:
        if (!examCategory) errors.examCategory = 'Exam category is required';
        if (examCategory === 'others' && !customExamCategory.trim()) {
          errors.customExamCategory = 'Please specify your exam category';
        }
        if (examCategory && examCategory !== 'others' && !targetExam) {
          errors.targetExam = 'Target exam is required';
        }
        if (targetExam === 'others' && !customTargetExam.trim()) {
          errors.customTargetExam = 'Please specify your target exam';
        }
        break;
      case 4:
        if (!preparationStartDate) errors.preparationStartDate = 'Preparation start date is required';
        if (!selectedState) errors.selectedState = 'State is required';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleQuickLogin = async (demoAccount: typeof demoAccounts[0] | typeof employeeCategoryAccounts[0] | typeof adminCategoryAccounts[0]) => {
    try {
      await login(demoAccount.email, demoAccount.password);
    } catch (error) {
      console.error('Quick login failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;

    try {
      await register(name, email, password, role);
      
      // Store profile data locally
      const profileData: UserProfile = {
        username,
        email,
        phone,
        examCategory: examCategory === 'others' ? 'others' : examCategory,
        customExamCategory: examCategory === 'others' ? customExamCategory : undefined,
        targetExam: targetExam === 'others' ? 'others' : targetExam,
        customTargetExam: targetExam === 'others' ? customTargetExam : undefined,
        preparationStartDate,
        state: selectedState
      };
      setUserProfile(profileData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const availableExams = examCategory && examCategory !== 'others' ? getExamsByCategory(examCategory) : [];

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn("h-12 text-base", formErrors.username && "border-red-500")}
                />
                {formErrors.username && <p className="text-red-500 text-xs">{formErrors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn("h-12 text-base", formErrors.name && "border-red-500")}
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn("h-12 text-base", formErrors.email && "border-red-500")}
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+91 9876543210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn("h-12 text-base", formErrors.phone && "border-red-500")}
              />
              {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4">Security</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
                <Input 
                  id="register-password" 
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn("h-12 text-base", formErrors.password && "border-red-500")}
                />
                {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn("h-12 text-base", formErrors.confirmPassword && "border-red-500")}
                />
                {formErrors.confirmPassword && <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role (Demo Purposes)</Label>
              <Select value={role as string} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="student" className="text-base py-3">Student</SelectItem>
                  <SelectItem value="mentor" className="text-base py-3">Mentor</SelectItem>
                  <SelectItem value="employee" className="text-base py-3">Employee</SelectItem>
                  <SelectItem value="admin" className="text-base py-3">Admin</SelectItem>
                  <SelectItem value="super-admin" className="text-base py-3">Super Admin</SelectItem>
                  <SelectItem value="owner" className="text-base py-3">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4">Exam Preferences</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam-category" className="text-sm font-medium">Select Your Exam Category</Label>
                <Select value={examCategory} onValueChange={setExamCategory}>
                  <SelectTrigger className={cn("h-12 text-base", formErrors.examCategory && "border-red-500")}>
                    <SelectValue placeholder="Choose exam category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-white border shadow-lg z-50">
                    {examCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-base py-3">
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="others" className="text-base py-3">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.examCategory && <p className="text-red-500 text-xs">{formErrors.examCategory}</p>}
              </div>

              {examCategory === 'others' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-exam-category" className="text-sm font-medium">Enter Your Exam Category</Label>
                  <Input 
                    id="custom-exam-category" 
                    placeholder="e.g., State Government Exams" 
                    value={customExamCategory}
                    onChange={(e) => setCustomExamCategory(e.target.value)}
                    className={cn("h-12 text-base", formErrors.customExamCategory && "border-red-500")}
                  />
                  {formErrors.customExamCategory && <p className="text-red-500 text-xs">{formErrors.customExamCategory}</p>}
                </div>
              )}

              {examCategory && examCategory !== 'others' && (
                <div className="space-y-2">
                  <Label htmlFor="target-exam" className="text-sm font-medium">Your Target Exam</Label>
                  <Select value={targetExam} onValueChange={setTargetExam}>
                    <SelectTrigger className={cn("h-12 text-base", formErrors.targetExam && "border-red-500")}>
                      <SelectValue placeholder="Choose your target exam" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-white border shadow-lg z-50">
                      {availableExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id} className="text-base py-3">
                          {exam.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="others" className="text-base py-3">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.targetExam && <p className="text-red-500 text-xs">{formErrors.targetExam}</p>}
                </div>
              )}

              {targetExam === 'others' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-target-exam" className="text-sm font-medium">Enter Your Target Exam</Label>
                  <Input 
                    id="custom-target-exam" 
                    placeholder="e.g., TNPSC Group 1" 
                    value={customTargetExam}
                    onChange={(e) => setCustomTargetExam(e.target.value)}
                    className={cn("h-12 text-base", formErrors.customTargetExam && "border-red-500")}
                  />
                  {formErrors.customTargetExam && <p className="text-red-500 text-xs">{formErrors.customTargetExam}</p>}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preparation Start Date</Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !preparationStartDate && "text-muted-foreground",
                        formErrors.preparationStartDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {preparationStartDate ? format(preparationStartDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <EnhancedCalendar
                      mode="single"
                      selected={preparationStartDate || undefined}
                      onSelect={(date) => {
                        setPreparationStartDate(date || null);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.preparationStartDate && <p className="text-red-500 text-xs">{formErrors.preparationStartDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">Your State</Label>
                <EnhancedSelect value={selectedState} onValueChange={setSelectedState}>
                  <EnhancedSelectTrigger className={cn("h-12 text-base", formErrors.selectedState && "border-red-500")}>
                    <EnhancedSelectValue placeholder="Select state" />
                  </EnhancedSelectTrigger>
                  <EnhancedSelectContent searchable searchPlaceholder="Search states...">
                    {indiaStates.map((state) => (
                      <EnhancedSelectItem key={state.id} value={state.id} className="text-base py-3">
                        {state.name}
                      </EnhancedSelectItem>
                    ))}
                  </EnhancedSelectContent>
                </EnhancedSelect>
                {formErrors.selectedState && <p className="text-red-500 text-xs">{formErrors.selectedState}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
      <DialogTitle className="text-2xl font-bold text-center mb-2">
        {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
      </DialogTitle>
      <DialogDescription className="text-center text-gray-600 mb-6">
        {activeTab === 'login' 
          ? 'Sign in to your account or try a demo account'
          : 'Join PrepSmart to start your exam preparation journey'
        }
      </DialogDescription>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
          <TabsTrigger value="register" className="text-sm sm:text-base">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-6">
          {/* Quick Demo Login Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Try Demo Accounts</h3>
              <p className="text-sm text-gray-600 mb-4">Quick access to explore different user roles</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.slice(0, 4).map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                  onClick={() => handleQuickLogin(account)}
                >
                  <div className={`p-2 rounded-full ${account.color} text-white`}>
                    <account.icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{account.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.slice(4).map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                  onClick={() => handleQuickLogin(account)}
                >
                  <div className={`p-2 rounded-full ${account.color} text-white`}>
                    <account.icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{account.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Admin Category Accounts Section */}
            <div className="mt-6">
              <div className="text-center mb-4">
                <h4 className="text-md font-semibold text-gray-800">Admin by Exam Category</h4>
                <p className="text-xs text-gray-600">Category-specific admin access for different exam types</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {adminCategoryAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-gray-50 border-dashed border-2"
                    onClick={() => handleQuickLogin(account)}
                  >
                    <div className={`p-2 rounded-full ${account.color} text-white`}>
                      <account.icon className="h-3 w-3" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">{account.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Employee Category Accounts Section */}
            <div className="mt-6">
              <div className="text-center mb-4">
                <h4 className="text-md font-semibold text-gray-800">Employee Categories</h4>
                <p className="text-xs text-gray-600">Specialized employee roles with category-specific dashboards</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employeeCategoryAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-gray-50 border-dashed"
                    onClick={() => handleQuickLogin(account)}
                  >
                    <div className={`p-2 rounded-full ${account.color} text-white`}>
                      <account.icon className="h-3 w-3" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">{account.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or login manually</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-xs text-brand-blue hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium">
              Login
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register" className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i + 1 < currentStep ? "bg-green-500 text-white" : 
                  i + 1 === currentStep ? "bg-blue-500 text-white" : 
                  "bg-gray-200 text-gray-600"
                )}>
                  {i + 1 < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-1",
                    i + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {renderFormStep()}
            
            {selectedExam && (
              <div className="p-4 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                <p className="text-sm">
                  Selected exam category: <span className="font-medium">{selectedExam}</span>
                </p>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className={cn("h-12", currentStep === 1 ? "w-full" : "flex-1")}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="flex-1 h-12 text-base font-medium">
                  Create Account
                </Button>
              )}
            </div>
            
            <p className="text-xs text-center text-gray-500 pt-2">
              By registering, you agree to our{' '}
              <a href="#" className="text-brand-blue hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthModal;
