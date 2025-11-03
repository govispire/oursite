import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface JourneyStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

const JourneyStatCard = ({ icon: Icon, label, value, subtitle, color }: JourneyStatCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};

export default JourneyStatCard;
