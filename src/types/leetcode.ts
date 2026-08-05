export interface LeetCodeUserProfile {
  username: string;
  realName: string;
  avatarUrl: string;
  ranking: number;
  reputation: number;
  country: string | null;
  company: string | null;
  school: string | null;
  aboutMe: string;
  websites: string[];
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
}

export interface LeetCodeSolvedStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

export interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  runtime: string;
  memory: string;
}

export interface LeetCodeContestInfo {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number;
  totalParticipants: number;
  contestTopPercentage: number;
  contestBadge: string | null;
  contestHistory: LeetCodeContestRecord[];
}

export interface LeetCodeContestRecord {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  contest: {
    title: string;
    startTime: number;
  };
}

export interface LeetCodeSkillTag {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeCalendar {
  submissionCalendar: Record<string, number>;
  streak: number;      // current streak (computed)
  maxStreak: number;   // all-time max streak (from API)
  totalActiveDays: number;
}

export interface LeetCodeFullStats {
  profile: LeetCodeUserProfile;
  solved: LeetCodeSolvedStats;
  submissions: LeetCodeSubmission[];
  contest: LeetCodeContestInfo;
  skills: {
    advanced: LeetCodeSkillTag[];
    intermediate: LeetCodeSkillTag[];
    fundamental: LeetCodeSkillTag[];
  };
  calendar: LeetCodeCalendar;
}
