
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudentDataProvider } from '@/contexts/StudentDataContext';
import { ExamCategoryProvider } from '@/contexts/ExamCategoryContext';
import StudentRoutes from '@/routes/StudentRoutes';
import MentorRoutes from '@/routes/MentorRoutes';
import AdminRoutes from '@/routes/AdminRoutes';
import EmployeeRoutes from '@/routes/EmployeeRoutes';
import SuperAdminRoutes from '@/routes/SuperAdminRoutes';
import OwnerRoutes from '@/routes/OwnerRoutes';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <StudentDataProvider>
          <ExamCategoryProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/student/*" element={<StudentRoutes />} />
                <Route path="/mentor/*" element={<MentorRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/employee/*" element={<EmployeeRoutes />} />
                <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
                <Route path="/owner/*" element={<OwnerRoutes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </ExamCategoryProvider>
        </StudentDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
