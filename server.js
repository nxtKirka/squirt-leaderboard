const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3001;

// put your real Kirka API key here
const API_KEY = "369a51f67d8030be6e952ded7c1ddc0f3c582b3d024b9f6402a81cf80149759c";

app.get("/api/kirka/clan-scoreboard", async (req, res) => {
  const clan = req.query.clan;

  if (!clan) {
    return res.status(400).json({ error: "Clan name required" });
  }

  try {
    const response = await fetch(`https://api.kirka.io/api/clan/${clan}`, {
      headers: {
        ApiKey: API_KEY,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    const members = data.members || data.memberList || [];

 const formatted = members.map((m) => ({
  id: m.user?.id || "unknown",
  name: m.user?.name || "Unknown",
  totalScore: m.allScores || 0,
  clan: clan
}));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: String(err.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});