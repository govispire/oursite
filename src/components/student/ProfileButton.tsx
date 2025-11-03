
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, CreditCard, LogOut, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UniversalProfileCard from '@/components/universal/UniversalProfileCard';
import { useExamCategorySelection } from '@/hooks/useExamCategorySelection';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileButtonProps {
  showProfileCard?: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ showProfileCard = false }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(showProfileCard);
  const navigate = useNavigate();
  const { clearSelection } = useExamCategorySelection();
  const isMobile = useIsMobile();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getProfileRoute = () => {
    switch (user?.role) {
      case 'student':
        return '/student/profile';
      case 'employee':
        return '/employee/profile';
      case 'admin':
        return '/admin/profile';
      case 'mentor':
        return '/mentor/profile';
      case 'super-admin':
        return '/super-admin/profile';
      case 'owner':
        return '/owner/profile';
      default:
        return '/profile';
    }
  };

  const handleChangeExamCategory = () => {
    if (user?.role === 'student') {
      console.log('Clearing exam category selection from profile...');
      clearSelection();
      navigate('/student/exam-categories', { state: { fromProfile: true } });
    }
  };

  const handleViewProfile = () => {
    if (isMobile) {
      navigate(getProfileRoute());
    } else {
      setShowProfile(!showProfile);
    }
  };
  
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-8 sm:h-9 px-1 sm:px-2">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
              <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
              <AvatarFallback className="text-xs sm:text-sm">{getInitials(user?.name || "User")}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm">{user?.name || "User"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleViewProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>{isMobile ? 'View Profile' : (showProfile ? 'Hide Profile' : 'View Profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {user?.role === 'student' && (
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Subscription Plan</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {user?.role === 'student' && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleChangeExamCategory}>
                  <Book className="mr-2 h-4 w-4" />
                  <span>Change Exam Category</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => logout?.()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {!isMobile && showProfile && (
        <div className="absolute right-0 mt-2 z-50 w-96">
          <UniversalProfileCard />
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
