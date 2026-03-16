const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("AtarCMS API çalışıyor")
})

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: "Kullanıcılar alınamadı" })
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`)
})