const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// Validation'dan geçen body verisiyle yeni post oluşturur.
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.userId
      }
    })

    res.json(post)
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Param'dan gelen id ile tek bir post döner.
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    })

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const {
      page: rawPage = 1,
      limit: rawLimit = 10,
      search,
      authorId: rawAuthorId,
      sortBy = "createdAt",
      order = "desc"
    } = req.query

    // Query parametreleri URL'den geldigi icin string olabilir.
    const page = Number(rawPage)
    const limit = Number(rawLimit)
    const authorId = rawAuthorId ? Number(rawAuthorId) : undefined

    const where = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }

    if (authorId) {
      where.authorId = authorId
    }

    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    res.json({
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Silmeden önce kayıt bulunur, sonra sahiplik kontrol edilir.
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to delete this post" })
    }

    await prisma.post.delete({
      where: { id }
    })

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Validation veri biçimini kontrol eder, controller ise iş kurallarını yönetir.
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to update this post" })
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content
      }
    })

    res.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
