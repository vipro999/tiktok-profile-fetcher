export default function handler(req, res) {
  return res.status(200).json({
    message: "TikTok API root is working ✅",
    hint: "Try visiting /api/tiktok/yourusername next!"
  });
}
