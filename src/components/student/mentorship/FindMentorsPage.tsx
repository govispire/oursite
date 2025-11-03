import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grid, 
  List, 
  Search, 
  Star, 
  Heart,
  MessageSquare,
  Calendar,
  Filter,
  SortDesc,
  Users,
  BookOpen,
  Eye
} from 'lucide-react';
import { Mentor } from '@/data/mentorshipData';
import { useCategoryFilteredMentors } from '@/hooks/useCategoryFilteredContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategorySelector } from '@/components/global/CategorySelector';
import MentorDetailsModal from './MentorDetailsModal';

type ViewMode = 'grid' | 'list';
type SortOption = 'rating' | 'price-low' | 'price-high' | 'experience' | 'reviews';

const FindMentorsPage = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'list' : 'grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecificCategory, setSelectedSpecificCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedMentors, setWishlistedMentors] = useState<Set<number>>(new Set());

  const { mentors: globalFilteredMentors, getMentorsForCategory, selectedCategories, hasFilters } = useCategoryFilteredMentors();

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'upsc', name: 'UPSC' },
    { id: 'banking-insurance', name: 'Banking & Insurance' },
    { id: 'ssc', name: 'SSC' },
    { id: 'railway', name: 'Railway' },
    { id: 'cat', name: 'CAT/MBA' }
  ];

  // Get base mentors - either from global filter or specific category
  const baseMentors = useMemo(() => {
    if (selectedSpecificCategory === 'all') {
      // Show globally filtered mentors, limit to 10 per category for performance
      return hasFilters ? globalFilteredMentors : getMentorsForCategory('upsc', 10)
        .concat(getMentorsForCategory('banking-insurance', 10))
        .concat(getMentorsForCategory('ssc', 10))
        .concat(getMentorsForCategory('railway', 10))
        .concat(getMentorsForCategory('cat', 10));
    } else {
      // Show exactly 10 mentors for the selected specific category
      return getMentorsForCategory(selectedSpecificCategory, 10);
    }
  }, [selectedSpecificCategory, globalFilteredMentors, hasFilters, getMentorsForCategory]);

  // Filter and sort mentors
  const filteredAndSortedMentors = useMemo(() => {
    let filtered = baseMentors.filter(mentor => {
      // Search filter
      const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           mentor.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           mentor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));

      // Price filter
      const matchesPrice = mentor.price >= priceRange[0] && mentor.price <= priceRange[1];

      // Rating filter
      const matchesRating = mentor.rating >= minRating;

      return matchesSearch && matchesPrice && matchesRating;
    });

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [baseMentors, searchQuery, priceRange, minRating, sortBy]);

  const handleWishlistToggle = (mentorId: number) => {
    setWishlistedMentors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mentorId)) {
        newSet.delete(mentorId);
      } else {
        newSet.add(mentorId);
      }
      return newSet;
    });
  };

  const MentorGridCard = ({ mentor }: { mentor: Mentor }) => (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors truncate">
                {mentor.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">{mentor.qualification}</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                <span className="text-xs text-gray-500 ml-1">({mentor.reviews})</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle(mentor.id);
            }}
            className="p-1 touch-target"
          >
            <Heart className={`h-4 w-4 ${wishlistedMentors.has(mentor.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Experience</span>
            <span className="font-medium">{mentor.experience}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price</span>
            <span className="font-bold text-blue-600">₹{mentor.price}/session</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Subjects:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {mentor.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Languages:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.languages.slice(0, 2).map((language) => (
              <Badge key={language} variant="outline" className="text-xs">
                {language}
              </Badge>
            ))}
            {mentor.languages.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.languages.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 touch-button ${isMobile ? 'h-10' : ''}`}
            onClick={() => setSelectedMentor(mentor)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Profile
          </Button>
          <Button 
            size="sm" 
            className={`flex-1 touch-button ${isMobile ? 'h-10' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MentorListCard = ({ mentor }: { mentor: Mentor }) => (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className={`${isMobile ? 'w-12 h-12 text-sm' : 'w-16 h-16 text-lg'} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold`}>
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0 flex-1">
                <h3 className={`font-semibold group-hover:text-blue-600 transition-colors truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {mentor.name}
                </h3>
                <p className={`text-gray-600 truncate ${isMobile ? 'text-sm' : ''}`}>{mentor.qualification}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium ml-1 text-sm">{mentor.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({mentor.reviews})</span>
                </div>
                <div className={`font-bold text-blue-600 ${isMobile ? 'text-sm' : ''}`}>₹{mentor.price}/session</div>
              </div>
            </div>

            <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-2 gap-4'} mb-3`}>
              <div>
                <p className="text-sm text-gray-600">Experience: <span className="font-medium">{mentor.experience}</span></p>
                <p className="text-sm text-gray-600">Languages: {mentor.languages.slice(0, 2).join(', ')}{mentor.languages.length > 2 ? '...' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.subjects.slice(0, isMobile ? 2 : 4).map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {mentor.subjects.length > (isMobile ? 2 : 4) && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.subjects.length - (isMobile ? 2 : 4)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${isMobile ? 'touch-button flex-1' : ''}`}
                  onClick={() => setSelectedMentor(mentor)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {isMobile ? 'Profile' : 'View Profile'}
                </Button>
                <Button 
                  size="sm" 
                  className={`${isMobile ? 'touch-button flex-1' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Book
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle(mentor.id);
                }}
                className="ml-2 touch-target"
              >
                <Heart className={`h-4 w-4 ${wishlistedMentors.has(mentor.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Global Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>Find Your Perfect Mentor</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {hasFilters 
              ? `Showing mentors for your selected categories (${selectedCategories.length} selected)`
              : 'Browse through our expert mentors and find the perfect match'
            }
          </p>
        </div>
        <CategorySelector />
      </div>

      {/* Category Filter Banner */}
      {hasFilters && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Filtered Results</h3>
                <p className="text-sm text-blue-700">
                  Showing mentors for: {selectedCategories.join(', ')}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {baseMentors.length} mentors
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="touch-button"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {!isMobile && (
            <>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="touch-target"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="touch-target"
              >
                <List className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search and Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search mentors by name, subjects, or qualifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 touch-button"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-col sm:flex-row">
              <select
                value={selectedSpecificCategory}
                onChange={(e) => setSelectedSpecificCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm touch-button"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border rounded-md text-sm touch-button"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range (₹)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-20 touch-button"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                    className="w-20 touch-button"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md touch-button"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={3.5}>3.5+ Stars</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          Showing {filteredAndSortedMentors.length} of {baseMentors.length} mentors
          {selectedSpecificCategory !== 'all' && ` for ${categories.find(c => c.id === selectedSpecificCategory)?.name}`}
        </p>
        {searchQuery && (
          <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="touch-button">
            Clear Search
          </Button>
        )}
      </div>

      {/* Mentors Grid/List */}
      {filteredAndSortedMentors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>No mentors found</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Try adjusting your search criteria or filters to find more mentors.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedSpecificCategory('all');
              setPriceRange([0, 5000]);
              setMinRating(0);
            }} className="touch-button">
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          (viewMode === 'grid' && !isMobile)
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedMentors.map((mentor) => 
            (viewMode === 'grid' && !isMobile) ? (
              <MentorGridCard key={mentor.id} mentor={mentor} />
            ) : (
              <MentorListCard key={mentor.id} mentor={mentor} />
            )
          )}
        </div>
      )}

      {/* Mentor Details Modal */}
      <MentorDetailsModal
        mentor={selectedMentor}
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />
    </div>
  );
};

export default FindMentorsPage;
