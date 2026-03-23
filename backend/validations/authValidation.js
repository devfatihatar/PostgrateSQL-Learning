const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const registerSchema = {
  body: {
    name: {
      required: true,
      type: "string",
      trim: true,
      minLength: 2,
      maxLength: 80
    },
    email: {
      required: true,
      type: "string",
      trim: true,
      pattern: emailPattern,
      patternMessage: "email format is invalid"
    },
    password: {
      required: true,
      type: "string",
      minLength: 6,
      maxLength: 100
    }
  }
}

const loginSchema = {
  body: {
    email: {
      required: true,
      type: "string",
      trim: true,
      pattern: emailPattern,
      patternMessage: "email format is invalid"
    },
    password: {
      required: true,
      type: "string",
      minLength: 6,
      maxLength: 100
    }
  }
}

module.exports = {
  registerSchema,
  loginSchema
}
