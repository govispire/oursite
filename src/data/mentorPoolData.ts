export type MentorLanguage = 'english' | 'hindi' | 'tamil' | 'malayalam' | 'kannada' | 'telugu';
export type MentorStage = 'prelims' | 'mains' | 'interview' | 'overall';

export interface MentorPoolEntry {
  id: string;
  name: string;
  photo: string;
  expertise: MentorStage[];
  languages: MentorLanguage[];
  examCategories: string[];
  rating: number;
  responseMins: number;
  studentsAssigned: number;
  capacity: number;
  bio: string;
  yearsExperience: number;
}

export const mentorPool: MentorPoolEntry[] = [
  { id: 'm1', name: 'Rajesh Kumar', photo: 'https://i.pravatar.cc/150?img=12', expertise: ['prelims', 'overall'], languages: ['hindi', 'english'], examCategories: ['banking', 'ssc'], rating: 4.8, responseMins: 12, studentsAssigned: 14, capacity: 20, bio: 'Banking exam expert with 8+ years coaching IBPS/SBI aspirants.', yearsExperience: 8 },
  { id: 'm2', name: 'Priya Menon', photo: 'https://i.pravatar.cc/150?img=47', expertise: ['mains', 'interview'], languages: ['malayalam', 'english'], examCategories: ['civil-services', 'banking'], rating: 4.9, responseMins: 8, studentsAssigned: 11, capacity: 20, bio: 'Civil services mentor with strong descriptive writing focus.', yearsExperience: 10 },
  { id: 'm3', name: 'Senthil Kumar', photo: 'https://i.pravatar.cc/150?img=33', expertise: ['prelims', 'mains'], languages: ['tamil', 'english'], examCategories: ['tamil-nadu-exams', 'ssc'], rating: 4.7, responseMins: 15, studentsAssigned: 18, capacity: 20, bio: 'TNPSC and SSC specialist focused on speed-accuracy.', yearsExperience: 7 },
  { id: 'm4', name: 'Anjali Sharma', photo: 'https://i.pravatar.cc/150?img=45', expertise: ['overall'], languages: ['hindi', 'english'], examCategories: ['ssc', 'railways-rrb'], rating: 4.6, responseMins: 20, studentsAssigned: 9, capacity: 20, bio: 'SSC and Railway exams full-cycle preparation expert.', yearsExperience: 6 },
  { id: 'm5', name: 'Karthik Reddy', photo: 'https://i.pravatar.cc/150?img=15', expertise: ['prelims'], languages: ['telugu', 'english'], examCategories: ['banking', 'civil-services'], rating: 4.5, responseMins: 18, studentsAssigned: 15, capacity: 20, bio: 'Quant + Reasoning prelims specialist.', yearsExperience: 5 },
  { id: 'm6', name: 'Suresh Gowda', photo: 'https://i.pravatar.cc/150?img=68', expertise: ['mains', 'overall'], languages: ['kannada', 'english'], examCategories: ['karnataka-exams', 'banking'], rating: 4.7, responseMins: 14, studentsAssigned: 12, capacity: 20, bio: 'Karnataka state exams + Banking mains mentor.', yearsExperience: 9 },
  { id: 'm7', name: 'Ravi Iyer', photo: 'https://i.pravatar.cc/150?img=51', expertise: ['interview'], languages: ['english', 'tamil'], examCategories: ['civil-services', 'banking'], rating: 4.9, responseMins: 10, studentsAssigned: 7, capacity: 15, bio: 'Personality and interview coach for civil services.', yearsExperience: 12 },
  { id: 'm8', name: 'Neha Verma', photo: 'https://i.pravatar.cc/150?img=44', expertise: ['prelims', 'mains'], languages: ['hindi', 'english'], examCategories: ['banking', 'ssc'], rating: 4.8, responseMins: 9, studentsAssigned: 16, capacity: 20, bio: 'English and reasoning expert with bank PO focus.', yearsExperience: 6 },
  { id: 'm9', name: 'Arun Pillai', photo: 'https://i.pravatar.cc/150?img=53', expertise: ['overall'], languages: ['malayalam', 'english'], examCategories: ['banking', 'ssc'], rating: 4.6, responseMins: 16, studentsAssigned: 13, capacity: 20, bio: 'Holistic mentor for Kerala-based banking aspirants.', yearsExperience: 7 },
  { id: 'm10', name: 'Divya Nair', photo: 'https://i.pravatar.cc/150?img=49', expertise: ['mains'], languages: ['malayalam', 'tamil', 'english'], examCategories: ['civil-services', 'tamil-nadu-exams'], rating: 4.7, responseMins: 13, studentsAssigned: 10, capacity: 20, bio: 'Mains-focused mentor with bilingual support.', yearsExperience: 8 },
  { id: 'm11', name: 'Vikram Singh', photo: 'https://i.pravatar.cc/150?img=14', expertise: ['prelims', 'overall'], languages: ['hindi', 'english'], examCategories: ['railways-rrb', 'ssc'], rating: 4.5, responseMins: 22, studentsAssigned: 19, capacity: 20, bio: 'Railway exam veteran focusing on technical prep.', yearsExperience: 11 },
  { id: 'm12', name: 'Lakshmi Rao', photo: 'https://i.pravatar.cc/150?img=48', expertise: ['mains', 'interview'], languages: ['telugu', 'kannada', 'english'], examCategories: ['civil-services'], rating: 4.8, responseMins: 11, studentsAssigned: 8, capacity: 15, bio: 'UPSC mains + interview specialist.', yearsExperience: 10 },
  { id: 'm13', name: 'Manoj Pandey', photo: 'https://i.pravatar.cc/150?img=59', expertise: ['overall'], languages: ['hindi', 'english'], examCategories: ['banking', 'regulatory'], rating: 4.6, responseMins: 17, studentsAssigned: 11, capacity: 20, bio: 'RBI/NABARD focused regulatory exam mentor.', yearsExperience: 9 },
  { id: 'm14', name: 'Geetha Krishnan', photo: 'https://i.pravatar.cc/150?img=46', expertise: ['prelims'], languages: ['tamil', 'malayalam', 'english'], examCategories: ['tamil-nadu-exams', 'banking'], rating: 4.7, responseMins: 13, studentsAssigned: 6, capacity: 20, bio: 'Speed test and accuracy drill mentor.', yearsExperience: 5 },
  { id: 'm15', name: 'Rohit Joshi', photo: 'https://i.pravatar.cc/150?img=11', expertise: ['mains', 'overall'], languages: ['hindi', 'english'], examCategories: ['ssc', 'civil-services'], rating: 4.8, responseMins: 10, studentsAssigned: 12, capacity: 20, bio: 'Descriptive writing and essay mentor.', yearsExperience: 8 },
];

export const LANGUAGE_LABELS: Record<MentorLanguage, string> = {
  english: 'English',
  hindi: 'हिन्दी Hindi',
  tamil: 'தமிழ் Tamil',
  malayalam: 'മലയാളം Malayalam',
  kannada: 'ಕನ್ನಡ Kannada',
  telugu: 'తెలుగు Telugu',
};

export const STAGE_LABELS: Record<MentorStage, string> = {
  prelims: 'Prelims Expert',
  mains: 'Mains Expert',
  interview: 'Interview Coach',
  overall: 'Overall Mentor',
};
