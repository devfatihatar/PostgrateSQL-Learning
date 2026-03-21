// setup prisma client
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.json({
  id: user.id,
  name: user.name,
  email: user.email
})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Kayıt başarısız" })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" })
    }

    // şifre karşılaştır
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Şifre yanlış" })
    }

    // token üret
    const token = jwt.sign(
      { userId: user.id },
      "gizli_anahtar",
      { expiresIn: "1h" }
    )

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Giriş başarısız" })
  }
}