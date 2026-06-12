/**
 * LeetCode API Layer
 * ──────────────────
 * All GraphQL query strings and the unified fetch helper.
 * Requests go through our local Express proxy at /api/leetcode
 * to avoid CORS issues.
 */

const PROXY_URL = "/api/leetcode";

/** Unified GraphQL fetch helper */
async function fetchLeetCode(query, variables = {}) {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// ── GraphQL Queries ───────────────────────────────────────────

/** Main profile + solved stats + badges */
const PROFILE_QUERY = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        skillTags
        postViewCount
        postViewCountDiff
        reputation
        reputationDiff
        solutionCount
        categoryDiscussCount
        certificationLevel
        starRating
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
      upcomingBadges {
        name
        icon
      }
      activeBadge {
        displayName
        icon
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

/** Contest ranking info */
const CONTEST_QUERY = `
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
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      rating
      ranking
      contest {
        title
        startTime
      }
    }
  }
`;

/** Recent accepted submissions */
const RECENT_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      lang
      runtime
      memory
    }
  }
`;

/** Submission calendar / heatmap */
const CALENDAR_QUERY = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        dccBadges {
          timestamp
          badge { name icon }
        }
        submissionCalendar
      }
    }
  }
`;

// ── Exported API functions ────────────────────────────────────

/** Fetch full profile + solved stats */
export async function fetchUserProfile(username) {
  const data = await fetchLeetCode(PROFILE_QUERY, { username });
  if (!data.matchedUser) throw new Error(`User "${username}" not found.`);
  return {
    user: data.matchedUser,
    allQuestionsCount: data.allQuestionsCount,
  };
}

/** Fetch contest rating and history */
export async function fetchContestData(username) {
  const data = await fetchLeetCode(CONTEST_QUERY, { username });
  return {
    contestRanking: data.userContestRanking,
    contestHistory: data.userContestRankingHistory || [],
  };
}

/** Fetch last N accepted submissions */
export async function fetchRecentSubmissions(username, limit = 20) {
  const data = await fetchLeetCode(RECENT_SUBMISSIONS_QUERY, {
    username,
    limit,
  });
  return data.recentAcSubmissionList || [];
}

/** Fetch submission heatmap calendar */
export async function fetchCalendar(username, year = new Date().getFullYear()) {
  const data = await fetchLeetCode(CALENDAR_QUERY, { username, year });
  return data.matchedUser?.userCalendar || null;
}

/** Derive acceptance rate from submitStats */
export function computeAcceptanceRate(submitStats) {
  if (!submitStats?.acSubmissionNum) return 0;
  const allStats = submitStats.acSubmissionNum;
  const allEntry = allStats.find((s) => s.difficulty === "All");
  if (!allEntry || allEntry.submissions === 0) return 0;
  return ((allEntry.count / allEntry.submissions) * 100).toFixed(1);
}

/** Map difficulty name → solved count */
export function parseSolvedByDifficulty(submitStats) {
  const map = {};
  (submitStats?.acSubmissionNum || []).forEach((s) => {
    map[s.difficulty] = s.count;
  });
  return {
    all: map["All"] || 0,
    easy: map["Easy"] || 0,
    medium: map["Medium"] || 0,
    hard: map["Hard"] || 0,
  };
}

/** Map allQuestionsCount array → total per difficulty */
export function parseTotalByDifficulty(allQuestionsCount = []) {
  const map = {};
  allQuestionsCount.forEach((q) => {
    map[q.difficulty] = q.count;
  });
  return {
    all: map["All"] || 0,
    easy: map["Easy"] || 0,
    medium: map["Medium"] || 0,
    hard: map["Hard"] || 0,
  };
}
