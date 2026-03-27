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
    },
    imageUrl: {
      type: "string",
      trim: true,
      maxLength: 500
    }
  }
}

const updatePostSchema = {
  params: postIdSchema.params,
  body: createPostSchema.body
}

const getPostsQuerySchema = {
  query: {
    page: {
      type: "number",
      integer: true,
      min: 1
    },
    limit: {
      type: "number",
      integer: true,
      min: 1,
      max: 50
    },
    authorId: {
      type: "number",
      integer: true,
      positive: true
    },
    search: {
      type: "string",
      trim: true,
      minLength: 1,
      maxLength: 100
    },
    sortBy: {
      type: "string",
      trim: true,
      oneOf: ["createdAt", "title"]
    },
    order: {
      type: "string",
      trim: true,
      oneOf: ["asc", "desc"]
    }
  }
}

module.exports = {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema
}
