// api/tiktok/[username].js
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: "Missing username" });

    const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/117.0 Safari/537.36",
    };

    const response = await axios.get(url, { headers, timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);

    // lấy thông tin từ meta tags
    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content");
    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content");
    const metaDesc =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    // follower từ meta description
    let followers = null;
    const match = metaDesc?.match(/([\d.,]+)\s*(k|m|b|K|M|B)?\s*Followers/i);
    if (match) {
      let num = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase();
      if (unit === "k") num *= 1e3;
      if (unit === "m") num *= 1e6;
      if (unit === "b") num *= 1e9;
      followers = Math.round(num);
    }

    const displayName = ogTitle?.split("•")[0]?.trim() || username;

    res.status(200).json({
      username,
      displayName,
      avatar: ogImage,
      followers,
      sourceUrl: url,
    });
  } catch (err) {
    console.error("TikTok fetch error:", err.message);
    res.status(500).json({ error: "Unable to fetch TikTok profile" });
  }
}
