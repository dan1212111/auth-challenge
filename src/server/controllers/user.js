const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const jwtSecret = "mysecret"

const register = async (req, res) => {
  const { username, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const createdUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  })

  res.json({ data: createdUser })
}

const login = async (req, res) => {
  const { username, password } = req.body

  const foundUser = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  const passwordsMatch = await bcrypt.compare(password, foundUser.password)

  if (!foundUser || !passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." })
  }


  const payload = {
    username: username,
    password: password,
    userId: foundUser.id
  }

  const token = jwt.sign(payload, jwtSecret)
  res.json({ data: token })
}

module.exports = {
  register,
  login,
}
