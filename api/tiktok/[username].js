export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const response = await fetch(
      `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": "d8cfada207mshf8260c74db8afbbp1a0ebfjsnc450d9c8053b",
          "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();

    if (!data || !data.data || !data.data.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = data.data.user;
    const stats = data.data.stats;

    res.status(200).json({
      username: user.unique_id,
      nickname: user.nickname,
      avatar: user.avatar_larger,
      followers: stats.followerCount,
      following: stats.followingCount,
      likes: stats.heartCount,
    });
  } catch (err) {
    console.error("TikTok API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
