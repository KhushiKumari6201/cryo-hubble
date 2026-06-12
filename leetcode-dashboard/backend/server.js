/**
 * LeetCode GraphQL Proxy Server
 * ─────────────────────────────
 * Bypasses browser CORS restrictions by forwarding GraphQL
 * requests from the React frontend to LeetCode's internal API.
 *
 * Runs on: http://localhost:3001
 */

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

// Enable CORS for local Vite dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── LeetCode GraphQL Proxy ────────────────────────────────────
app.post("/api/leetcode", async (req, res) => {
  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ error: "GraphQL query is required." });
  }

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Mimic a real browser request so LeetCode doesn't block us
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://leetcode.com/",
        Origin: "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`LeetCode API error: ${response.status}`, text);
      return res.status(response.status).json({
        error: `LeetCode returned ${response.status}`,
        details: text.slice(0, 300),
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err.message);
    return res.status(502).json({
      error: "Failed to reach LeetCode API. Check your network.",
      details: err.message,
    });
  }
});

// ── Contest history proxy (different endpoint) ────────────────
app.get("/api/leetcode/contest/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await fetch(
      `https://leetcode.com/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Referer: "https://leetcode.com/",
          Origin: "https://leetcode.com",
        },
        body: JSON.stringify({
          query: `
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
                contest { title startTime }
              }
            }
          `,
          variables: { username },
        }),
      }
    );
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 LeetCode Proxy running at http://localhost:${PORT}`);
  console.log(`   Forwarding requests to https://leetcode.com/graphql\n`);
});
