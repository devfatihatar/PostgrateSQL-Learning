//Dependency imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

//Initialize Express app and Prisma client
const app = express();
const prisma  = new PrismaClient();

//Middleware setup
app.use(cors());
app.use(express.json());

//Start the server
app.get("/", (req, res) => {
    res.send("AtarCMS API is running...");
})

//API endpoint to fetch all users
app.get("/users", async (req,res) =>
{
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
})
const PORT = 5000;

//Start the server
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});