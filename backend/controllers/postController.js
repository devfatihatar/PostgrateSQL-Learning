const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const {title, content} = req.body

        // For debug
        console.log("User ID from token:", req.user)

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.userId //Token'dan userId'yi alarak postu oluştur
            }
        })

        res.json(post)
    } catch (error) {
        console.error("Error creating post:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.getPostById = async (req, res) => {
    try {
        const {id} = req.params

        const post = await prisma.post.findUnique({
            where: {id: parseInt(id)},
            include: {
                author: true // Postun yazar bilgilerini de dahil et
            }
        })
        res.json(post)
    }catch (error) {
        console.error("Error fetching post:", error)
        res.status(500).json({error: "Internal server error"})
    }
}

exports.getPosts = async (req, res) => {
    try{
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        res.json(posts)
    }catch (error) {
        console.error("Error fetching posts:", error)
        res.status(500).json({error: "Internal server error"})
    }
}