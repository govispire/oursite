export interface MentorshipCategory {
  id: string;
  name: string;
  description: string;
  studentsEnrolled: number;
  mentorsAvailable: number;
  logo: string;
  colorClass: string;
  bgGradient: string;
  isCombo?: boolean;
}

export interface Mentor {
  id: number;
  name: string;
  qualification: string;
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  subjects: string[];
  avatar: string;
  languages: string[];
  availability: string[];
  categoryId: string;
  bio: string;
}

export const mentorshipCategories: MentorshipCategory[] = [
  // Banking & Insurance
  {
    id: 'banking-insurance',
    name: 'Banking & Insurance',
    description: 'SBI PO, IBPS, Insurance exams',
    studentsEnrolled: 12500,
    mentorsAvailable: 85,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125088/sbi.webp',
    colorClass: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    bgGradient: 'from-blue-50 to-blue-100'
  },
  
  // UPSC
  {
    id: 'upsc',
    name: 'UPSC',
    description: 'Civil Services, IAS, IPS, IFS',
    studentsEnrolled: 16800,
    mentorsAvailable: 138,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
    bgGradient: 'from-indigo-50 to-indigo-100'
  },
  
  // SSC
  {
    id: 'ssc',
    name: 'SSC',
    description: 'CGL, CHSL, MTS, GD',
    studentsEnrolled: 22100,
    mentorsAvailable: 156,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-green-50 border-green-200 hover:border-green-300',
    bgGradient: 'from-green-50 to-green-100'
  },
  
  // Railways
  {
    id: 'railway',
    name: 'Railway',
    description: 'RRB NTPC, Group D, ALP',
    studentsEnrolled: 18400,
    mentorsAvailable: 92,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125088/RRB-NTPC_scjv3q.webp',
    colorClass: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    bgGradient: 'from-orange-50 to-orange-100'
  },

  // Civil Services
  {
    id: 'civil-services',
    name: 'Civil Services',
    description: 'State PSC, UPPSC, BPSC',
    studentsEnrolled: 9800,
    mentorsAvailable: 67,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-purple-50 border-purple-200 hover:border-purple-300',
    bgGradient: 'from-purple-50 to-purple-100'
  },

  // Teaching Exams
  {
    id: 'teaching',
    name: 'Teaching Exams',
    description: 'CTET, TET, KVS, NVS',
    studentsEnrolled: 14200,
    mentorsAvailable: 78,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-pink-50 border-pink-200 hover:border-pink-300',
    bgGradient: 'from-pink-50 to-pink-100'
  },

  // Agriculture
  {
    id: 'agriculture',
    name: 'Agriculture',
    description: 'ICAR, AO, AFO, Agricultural Officer',
    studentsEnrolled: 6700,
    mentorsAvailable: 34,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
    bgGradient: 'from-emerald-50 to-emerald-100'
  },

  // Defence
  {
    id: 'defence',
    name: 'Defence',
    description: 'CDS, AFCAT, NDA, Military',
    studentsEnrolled: 11500,
    mentorsAvailable: 58,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-red-50 border-red-200 hover:border-red-300',
    bgGradient: 'from-red-50 to-red-100'
  },

  // Engineering
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'GATE, ESE, PSU, Technical',
    studentsEnrolled: 19600,
    mentorsAvailable: 124,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-slate-50 border-slate-200 hover:border-slate-300',
    bgGradient: 'from-slate-50 to-slate-100'
  },

  // Combo Packs
  {
    id: 'banking-ssc-combo',
    name: 'Banking + SSC Combo',
    description: 'Combined preparation for Banking and SSC',
    studentsEnrolled: 8900,
    mentorsAvailable: 45,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125088/sbi.webp',
    colorClass: 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 hover:border-blue-300',
    bgGradient: 'from-blue-50 via-white to-green-50',
    isCombo: true
  },

  {
    id: 'railway-ssc-combo',
    name: 'Railway + SSC Combo',
    description: 'Combined preparation for Railway and SSC',
    studentsEnrolled: 7200,
    mentorsAvailable: 38,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125088/RRB-NTPC_scjv3q.webp',
    colorClass: 'bg-gradient-to-r from-orange-50 to-green-50 border-orange-200 hover:border-orange-300',
    bgGradient: 'from-orange-50 via-white to-green-50',
    isCombo: true
  },

  {
    id: 'upsc-civil-combo',
    name: 'UPSC + Civil Services Combo',
    description: 'Combined preparation for UPSC and State Civil Services',
    studentsEnrolled: 5600,
    mentorsAvailable: 32,
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    colorClass: 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300',
    bgGradient: 'from-indigo-50 via-white to-purple-50',
    isCombo: true
  }
];

export const sampleMentors: Mentor[] = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    qualification: 'M.A. Economics, UPSC CSE 2015',
    experience: '8+ years',
    rating: 4.9,
    reviews: 1247,
    price: 2000,
    subjects: ['General Studies', 'Current Affairs', 'Economics'],
    avatar: '/placeholder.svg',
    languages: ['Hindi', 'English'],
    availability: ['Monday', 'Wednesday', 'Friday'],
    categoryId: 'upsc',
    bio: 'Former IAS officer with extensive experience in guiding UPSC aspirants.'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    qualification: 'M.Com, SBI PO 2018',
    experience: '6+ years',
    rating: 4.8,
    reviews: 892,
    price: 1500,
    subjects: ['Quantitative Aptitude', 'Reasoning', 'Banking Awareness'],
    avatar: '/placeholder.svg',
    languages: ['Hindi', 'English', 'Punjabi'],
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    categoryId: 'banking-insurance',
    bio: 'Banking professional with proven track record in competitive exam guidance.'
  },
  {
    id: 3,
    name: 'Amit Singh',
    qualification: 'B.Tech, SSC CGL 2019',
    experience: '5+ years',
    rating: 4.7,
    reviews: 654,
    price: 1200,
    subjects: ['Mathematics', 'General Science', 'English'],
    avatar: '/placeholder.svg',
    languages: ['Hindi', 'English'],
    availability: ['Monday', 'Tuesday', 'Thursday'],
    categoryId: 'ssc',
    bio: 'SSC expert helping students crack government job exams with strategic preparation.'
  }
];

export const successStories = [
  {
    id: 1,
    studentName: 'Ankit Verma',
    exam: 'UPSC CSE 2023',
    rank: 47,
    mentorName: 'Dr. Rajesh Kumar',
    videoUrl: '/placeholder-video.mp4',
    testimonial: 'Dr. Rajesh sir guided me through every step of my UPSC journey.',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 2,
    studentName: 'Sneha Gupta',
    exam: 'SBI PO 2023',
    rank: 12,
    mentorName: 'Priya Sharma',
    videoUrl: '/placeholder-video.mp4',
    testimonial: 'Priya maam\'s teaching methodology helped me crack SBI PO in first attempt.',
    thumbnail: '/placeholder.svg'
  }
];
