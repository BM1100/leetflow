import type {
  LeetCodeFullStats,
  LeetCodeUserProfile,
  LeetCodeSolvedStats,
  LeetCodeContestInfo,
  LeetCodeCalendar,
} from '@/types/leetcode';

const LEETCODE_GQL = 'https://leetcode.com/graphql';

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(LEETCODE_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'Origin': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LeetCode API error ${res.status}${text ? ': ' + text.slice(0, 200) : ''}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'GraphQL error');
  return json.data;
}

export async function getLeetCodeProfile(username: string): Promise<LeetCodeUserProfile> {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
          reputation
          countryName
          company
          school
          aboutMe
          websites
        }
      }
    }
  `;
  const data = await gql(query, { username });
  const user = data?.matchedUser;
  if (!user) throw new Error(`User "${username}" not found on LeetCode`);
  const p = user.profile;
  return {
    username: user.username,
    realName: p.realName || username,
    avatarUrl: p.userAvatar || '',
    ranking: p.ranking || 0,
    reputation: p.reputation || 0,
    country: p.countryName || null,
    company: p.company || null,
    school: p.school || null,
    aboutMe: p.aboutMe || '',
    websites: p.websites || [],
    githubUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
  };
}

export async function getLeetCodeSolvedStats(username: string): Promise<LeetCodeSolvedStats> {
  const query = `
    query userSolvedProblemsInfo($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum { difficulty count submissions }
          totalSubmissionNum { difficulty count submissions }
        }
        profile {
          ranking
          reputation
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;
  const data = await gql(query, { username });
  const user = data?.matchedUser;
  if (!user) throw new Error(`User not found`);

  const acStats: Array<{ difficulty: string; count: number; submissions?: number }> =
    user.submitStats?.acSubmissionNum || [];
  const totalStats: Array<{ difficulty: string; count: number; submissions?: number }> =
    user.submitStats?.totalSubmissionNum || [];
  const allQ: Array<{ difficulty: string; count: number }> = data.allQuestionsCount || [];

  const get = (arr: typeof acStats, d: string) => arr.find((x) => x.difficulty === d);
  const getQ = (d: string) => allQ.find((x) => x.difficulty === d)?.count || 0;

  const allAC = get(acStats, 'All');
  const easy = get(acStats, 'Easy');
  const medium = get(acStats, 'Medium');
  const hard = get(acStats, 'Hard');
  const allTotal = get(totalStats, 'All');

  const acSubmissions = allAC?.submissions || allAC?.count || 0;
  const totalSubmissions = allTotal?.submissions || allTotal?.count || 0;

  const totalSolved = allAC?.count || 0;
  const acceptanceRate = totalSubmissions > 0
    ? Math.round((acSubmissions / totalSubmissions) * 100 * 10) / 10
    : 0;

  return {
    totalSolved,
    totalQuestions: getQ('All'),
    easySolved: easy?.count || 0,
    totalEasy: getQ('Easy'),
    mediumSolved: medium?.count || 0,
    totalMedium: getQ('Medium'),
    hardSolved: hard?.count || 0,
    totalHard: getQ('Hard'),
    acceptanceRate,
    ranking: user.profile?.ranking || 0,
    contributionPoints: 0,
    reputation: user.profile?.reputation || 0,
  };
}

export async function getLeetCodeContestInfo(username: string): Promise<LeetCodeContestInfo> {
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge { name }
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        contest { title startTime }
      }
    }
  `;
  const data = await gql(query, { username });
  const r = data?.userContestRanking; // null if < 6 contests attended
  const history: Record<string, unknown>[] = data?.userContestRankingHistory || [];

  const attendedHistory = history.filter((h) => h.attended);
  let rating = r?.rating || 0;

  if (!r && attendedHistory.length > 0) {
    const last = attendedHistory[attendedHistory.length - 1];
    rating = (last?.rating as number) || 0;
    if (rating === 1500) {
      const zeroSolvedCount = attendedHistory.filter((h) => (h.problemsSolved as number) === 0).length;
      if (zeroSolvedCount > 0) {
        rating = Math.max(1200, 1500 - zeroSolvedCount * 15);
      }
    }
  }

  return {
    contestAttend: r?.attendedContestsCount ?? attendedHistory.length,
    contestRating: rating,
    contestGlobalRanking: r?.globalRanking || 0,
    totalParticipants: r?.totalParticipants || 0,
    contestTopPercentage: r?.topPercentage || 0,
    contestBadge: r?.badge?.name || null,
    contestHistory: history.map((h) => ({
      attended: h.attended as boolean,
      rating: h.rating as number,
      ranking: h.ranking as number,
      trendDirection: h.trendDirection as string,
      problemsSolved: h.problemsSolved as number,
      totalProblems: h.totalProblems as number,
      finishTimeInSeconds: h.finishTimeInSeconds as number,
      contest: h.contest as { title: string; startTime: number },
    })),
  };
}


/** Compute current active streak by walking backwards from today in UTC */
function computeCurrentStreak(calendarMap: Record<string, number>): number {
  const dates = new Set<string>();
  for (const tsStr of Object.keys(calendarMap)) {
    const ts = parseInt(tsStr, 10);
    if (!isNaN(ts)) {
      const d = new Date(ts * 1000);
      const key = d.toISOString().split('T')[0];
      dates.add(key);
    }
  }

  const today = new Date();
  const check = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  let key = check.toISOString().split('T')[0];
  if (!dates.has(key)) {
    // If no submission today yet, check yesterday
    check.setUTCDate(check.getUTCDate() - 1);
    key = check.toISOString().split('T')[0];
  }

  let streak = 0;
  while (dates.has(key)) {
    streak++;
    check.setUTCDate(check.getUTCDate() - 1);
    key = check.toISOString().split('T')[0];
  }

  return streak;
}

export async function getLeetCodeCalendar(username: string): Promise<LeetCodeCalendar> {
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
          streak
          totalActiveDays
        }
      }
    }
  `;
  const data = await gql(query, { username });
  const cal = data?.matchedUser?.userCalendar;
  if (!cal) return { submissionCalendar: {}, streak: 0, maxStreak: 0, totalActiveDays: 0 };

  const calendarMap: Record<string, number> = JSON.parse(cal.submissionCalendar || '{}');
  const currentStreak = computeCurrentStreak(calendarMap);

  return {
    submissionCalendar: calendarMap,
    streak: currentStreak,              // Current active streak (14d)
    maxStreak: cal.streak || 0,         // All-time max streak (33d)
    totalActiveDays: cal.totalActiveDays || 0,
  };
}

export async function getRecentSubmissions(username: string, limit = 20) {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        lang
        runtime
        memory
        statusDisplay
      }
    }
  `;
  const data = await gql(query, { username, limit });
  return data?.recentAcSubmissionList || [];
}

export async function getLeetCodeSkills(username: string) {
  const query = `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
      }
    }
  `;
  const data = await gql(query, { username });
  return data?.matchedUser?.tagProblemCounts || { advanced: [], intermediate: [], fundamental: [] };
}

export async function getFullLeetCodeStats(username: string): Promise<LeetCodeFullStats> {
  const [profile, solved, contest, calendar, skills, submissions] = await Promise.allSettled([
    getLeetCodeProfile(username),
    getLeetCodeSolvedStats(username),
    getLeetCodeContestInfo(username),
    getLeetCodeCalendar(username),
    getLeetCodeSkills(username),
    getRecentSubmissions(username, 20),
  ]);

  // Log any partial failures
  const labels = ['profile', 'solved', 'contest', 'calendar', 'skills', 'submissions'];
  [profile, solved, contest, calendar, skills, submissions].forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[leetcode/${username}] ${labels[i]} failed:`, r.reason?.message ?? r.reason);
    } else {
      console.log(`[leetcode/${username}] ${labels[i]} OK`);
    }
  });

  if (profile.status === 'rejected') throw profile.reason;

  return {
    profile: profile.value,
    solved: solved.status === 'fulfilled' ? solved.value : { totalSolved: 0, totalQuestions: 0, easySolved: 0, totalEasy: 0, mediumSolved: 0, totalMedium: 0, hardSolved: 0, totalHard: 0, acceptanceRate: 0, ranking: 0, contributionPoints: 0, reputation: 0 },
    contest: contest.status === 'fulfilled' ? contest.value : { contestAttend: 0, contestRating: 0, contestGlobalRanking: 0, totalParticipants: 0, contestTopPercentage: 0, contestBadge: null, contestHistory: [] },
    calendar: calendar.status === 'fulfilled' ? calendar.value : { submissionCalendar: {}, streak: 0, maxStreak: 0, totalActiveDays: 0 },
    skills: skills.status === 'fulfilled' ? skills.value : { advanced: [], intermediate: [], fundamental: [] },
    submissions: submissions.status === 'fulfilled' ? submissions.value : [],
  };
}
