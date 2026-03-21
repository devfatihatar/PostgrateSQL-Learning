const express = require("express")
const router = express.Router()

const { register, login } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)

module.exports = router

router.get("/users", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})