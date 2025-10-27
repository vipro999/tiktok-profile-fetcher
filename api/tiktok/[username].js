export default async function handler(req, res) {
  const { username } = req.query;

  try {
    // Gọi API TikTok (qua RapidAPI)
    const response = await fetch(`https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'd8cfada207mshf8260c74db8afbbp1a0ebfjsnc450d9c8053b',
        'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
      }
    });

    const data = await response.json();

    if (!data || !data.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = {
      username: data.user.unique_id,
      nickname: data.user.nickname,
      avatar: data.user.avatar_larger.url_list[0],
      followers: data.stats.followerCount,
      following: data.stats.followingCount,
      likes: data.stats.heartCount,
    };

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
