
import React from 'react';
import UniversalProfileCard from '@/components/universal/UniversalProfileCard';

const StudentProfile = () => {
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and exam preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <UniversalProfileCard className="w-full" />
        </div>
        
        {/* Additional Profile Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Change Password</div>
                <div className="text-xs text-gray-500">Update your account password</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Notification Settings</div>
                <div className="text-xs text-gray-500">Manage your notification preferences</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Privacy Settings</div>
                <div className="text-xs text-gray-500">Control your privacy preferences</div>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Account Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-medium text-green-600">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">Aug 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm font-medium">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
