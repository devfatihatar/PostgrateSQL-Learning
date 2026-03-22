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

exports.deletePost = async (req, res) =>{
    try {

        const {id} = req.params

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        if(post.authorId !== req.user.userId){
            return res.status(403).json({error: "You are not authorized to delete this post"})
        }

        await prisma.post.delete({
            where: {
                id: parseInt(id)
            }
        })

        res.json({message: "Post deleted successfully"})

    }catch (error) {
        console.error("Error deleting post:", error)
        res.status(500).json({error: "Internal server error"})
    }
}

exports.updatePost = async (req, res) => {
    try {
        const {
            id,
            authorId
        } = req.params
        const postId = parseInt(id)
        const userId = parseInt(authorId)
        const {title, content} = req.body

        if (!req.user?.userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        if (Number.isNaN(postId)) {
            return res.status(400).json({ error: "Invalid post id" })
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        if(post.authorId !== req.user.userId){
            return res.status(403).json({error: "You are not authorized to update this post"})
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
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
