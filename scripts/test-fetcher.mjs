// Test the exact fetch that the fetcher does, using Node's native fetch.
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
const PROFILE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
        totalSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
        reputation
      }
    }
  }
`;

const res = await fetch(LEETCODE_GRAPHQL_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Referer: 'https://leetcode.com/',
    Origin: 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (compatible; my-portfolio/1.0; +https://sanjit-dev.vercel.app)',
  },
  body: JSON.stringify({ query: PROFILE_QUERY, variables: { username: 'sanjit12' } }),
});
console.log('HTTP', res.status);
const text = await res.text();
console.log('body length:', text.length);
console.log('body:', text.slice(0, 500));
