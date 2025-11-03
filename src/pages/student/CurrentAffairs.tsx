
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategorySelector } from '@/components/global/CategorySelector';
import { ActiveCategoryFilters } from '@/components/global/ActiveCategoryFilters';
import { useCategoryFilteredCurrentAffairs } from '@/hooks/useCategoryFilteredContent';
import { Calendar, Clock, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CurrentAffairs = () => {
  const { currentAffairs, stats, hasFilters, selectedCategories } = useCategoryFilteredCurrentAffairs();
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredAffairs = () => {
    if (activeTab === 'all') return currentAffairs;
    return currentAffairs.filter(affair => affair.type === activeTab);
  };

  const filteredAffairs = getFilteredAffairs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Current Affairs</h1>
          <p className="text-gray-600 mt-1">
            {hasFilters 
              ? `Stay updated with affairs relevant to your selected categories`
              : 'Select your exam categories to see relevant current affairs'
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
          filteredItems={filteredAffairs.length}
        />
      )}

      {/* Stats Cards */}
      {hasFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Affairs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attempted</p>
                  <p className="text-2xl font-bold">{stats.attempted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Updates</p>
                  <p className="text-2xl font-bold">{stats.daily}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly</p>
                  <p className="text-2xl font-bold">{stats.monthly}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({currentAffairs.length})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({stats.daily})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({stats.weekly})</TabsTrigger>
          <TabsTrigger value="monthly">Monthly ({stats.monthly})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredAffairs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {hasFilters ? 'No current affairs found' : 'Select Your Categories'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasFilters 
                    ? `No ${activeTab === 'all' ? '' : activeTab} current affairs match your selected categories.`
                    : 'Please select your exam categories using the Category Selector above to see relevant current affairs.'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAffairs.map((affair) => (
                <Card key={affair.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={affair.type === 'daily' ? 'default' : affair.type === 'weekly' ? 'secondary' : 'outline'}>
                        {affair.type}
                      </Badge>
                      <Badge variant={affair.difficulty === 'Easy' ? 'secondary' : affair.difficulty === 'Medium' ? 'default' : 'destructive'}>
                        {affair.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm line-clamp-2">{affair.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{affair.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {affair.date}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {affair.questions} questions
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {affair.topics.slice(0, 2).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {affair.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{affair.topics.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {affair.isAttempted ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            View Result
                          </Button>
                          <Button size="sm" className="flex-1 text-xs">
                            Reattempt
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="w-full text-xs">
                          Start Reading
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurrentAffairs;
