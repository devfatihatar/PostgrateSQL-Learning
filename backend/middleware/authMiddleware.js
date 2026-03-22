const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token yok" })
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization formati 'Bearer <token>' olmali" })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token yok" })
  }

  try {
    const decoded = jwt.verify(token, "gizli_anahtar")
    req.user = decoded
    next()
  } catch (error) {
    console.error("Token verification error:", error.message)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token suresi dolmus" })
    }

    return res.status(401).json({ error: "Gecersiz token" })
  }
}
