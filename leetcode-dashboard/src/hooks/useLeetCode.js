/**
 * useLeetCode – Custom hook
 * ─────────────────────────
 * Fetches all LeetCode data for a given username in parallel.
 * Exposes loading, error, data, and a refresh() function.
 */

import { useState, useCallback } from "react";
import {
  fetchUserProfile,
  fetchContestData,
  fetchRecentSubmissions,
  fetchCalendar,
  computeAcceptanceRate,
  parseSolvedByDifficulty,
  parseTotalByDifficulty,
} from "../api/leetcode";

export function useLeetCode(username) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    if (!username?.trim()) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      // Fire all requests in parallel for speed
      const [profileResult, contestResult, submissions, calendar] =
        await Promise.allSettled([
          fetchUserProfile(username),
          fetchContestData(username),
          fetchRecentSubmissions(username, 20),
          fetchCalendar(username),
        ]);

      // Extract results (settled means each may have succeeded or failed)
      const profile =
        profileResult.status === "fulfilled" ? profileResult.value : null;
      const contest =
        contestResult.status === "fulfilled" ? contestResult.value : null;
      const recentSubmissions =
        submissions.status === "fulfilled" ? submissions.value : [];
      const calendarData =
        calendar.status === "fulfilled" ? calendar.value : null;

      if (!profile) {
        throw profileResult.reason || new Error("Failed to load profile.");
      }

      const { user, allQuestionsCount } = profile;
      const solved = parseSolvedByDifficulty(user.submitStats);
      const totals = parseTotalByDifficulty(allQuestionsCount);
      const acceptanceRate = computeAcceptanceRate(user.submitStats);

      // Parse the heatmap JSON string from LeetCode
      let submissionCalendar = {};
      if (calendarData?.submissionCalendar) {
        try {
          submissionCalendar = JSON.parse(calendarData.submissionCalendar);
        } catch {
          submissionCalendar = {};
        }
      }

      setState({
        loading: false,
        error: null,
        lastUpdated: new Date(),
        data: {
          // Profile
          username: user.username,
          avatar: user.profile?.userAvatar,
          realName: user.profile?.realName,
          ranking: user.profile?.ranking,
          country: user.profile?.countryName,
          company: user.profile?.company,
          school: user.profile?.school,
          aboutMe: user.profile?.aboutMe,
          // Solved stats
          solved,
          totals,
          acceptanceRate,
          // Badges
          badges: user.badges || [],
          activeBadge: user.activeBadge,
          upcomingBadges: user.upcomingBadges || [],
          // Contest
          contestRanking: contest?.contestRanking || null,
          contestHistory: (contest?.contestHistory || []).filter(
            (h) => h.attended
          ),
          // Submissions
          recentSubmissions,
          // Calendar
          submissionCalendar,
          streak: calendarData?.streak || 0,
          totalActiveDays: calendarData?.totalActiveDays || 0,
        },
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message || "An unexpected error occurred.",
      }));
    }
  }, [username]);

  return { ...state, refresh: fetch };
}
