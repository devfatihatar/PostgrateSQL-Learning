const express = require('express')
const router = express.Router()

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} = require('../controllers/postController')

const authMiddleware = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const {
    postIdSchema,
    createPostSchema,
    updatePostSchema
} = require("../validations/postValidation")

router.post('/', authMiddleware, validate(createPostSchema), createPost)
router.get('/', getPosts)
router.get('/:id', validate(postIdSchema), getPostById)
router.put('/:id', authMiddleware, validate(updatePostSchema), updatePost)
router.delete('/:id', authMiddleware, validate(postIdSchema), deletePost)

module.exports = router
