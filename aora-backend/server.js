const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Post = require("./models/Post");

const app = express();
app.use(express.json());
app.use(cors());

//Anslut till MongoDB
mongoose
  .connect("mongodb://localhost:27017/aora", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB ansluten"))
  .catch((err) => console.error(err));

//en route för att registrera användare
app.post("/api/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Användare skapad" });
  } catch (error) {
    res.status(400).json({ error: "Email redan registrerad" });
  }
});

//En route för att logga in användare
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Försöker logga in med:", { email, password });
    const user = await User.findOne({ email });
    console.log("Hittad användare:", user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Fel email eller lösenord" });
    }
    const token = jwt.sign({ id: user._id }, "dinhemliganyckel", {
      expiresIn: "1h",
    });
    res.json({
      message: "inloggad",
      token,
      user: { id: user._id, email, username: user.username },
    });
  } catch (error) {
    console.error("Serverfel vid inloggning:", error);
    res.status(500).json({ error: "serverfel" });
  }
});

//En router för att hämta nuvarande användare
app.get("/api/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Ingen token" });
  try {
    const decoded = jwt.verify(token, "dinhemliganyckel");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "Användare ej hittad" });
    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (error) {
    res.status(401).json({ error: "Ogiltig token" });
  }
});

//En router för att hämta alla posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Fel vid hämtning av pots" });
  }
});

// POST: Skapa en ny post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, creator } = req.body;
    if (!title) return res.status(400).json({ message: "Title saknas" });
    const post = new Post({ title, creator });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fel vid skapande av post", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server kör på port 3000");
});
