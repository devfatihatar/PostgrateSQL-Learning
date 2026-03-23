const postIdSchema = {
  params: {
    id: {
      required: true,
      type: "number",
      integer: true,
      positive: true
    }
  }
}

const createPostSchema = {
  body: {
    title: {
      required: true,
      type: "string",
      trim: true,
      minLength: 3,
      maxLength: 150
    },
    content: {
      required: true,
      type: "string",
      trim: true,
      minLength: 10,
      maxLength: 5000
    }
  }
}

const updatePostSchema = {
  params: postIdSchema.params,
  body: createPostSchema.body
}

module.exports = {
  postIdSchema,
  createPostSchema,
  updatePostSchema
}
