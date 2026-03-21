//Dependency imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

//Route imports
const authRoutes = require("./routes/authRoutes")
const authMiddleware = require("./middleware/authMiddleware")
const postRoutes = require("./routes/postRoutes")

//Initialize Express app and Prisma client
const app = express();
const prisma  = new PrismaClient();

//Middleware setup
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes)
app.use("/posts", postRoutes)

//Start the server
app.get("/", (req, res) => {
    res.send("AtarCMS API is running...");
})

//API endpoint to fetch all users
app.get("/users",authMiddleware, async (req,res) =>
{
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
})

//API endpoint to create a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
});
const PORT = 5000;

//Start the server
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});