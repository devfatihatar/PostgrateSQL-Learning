const express = require("express")
const router = express.Router()

const { register, login } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const {
  registerSchema,
  loginSchema
} = require("../validations/authValidation")

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)

module.exports = router

router.get("/users", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})
