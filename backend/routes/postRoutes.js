const express = require('express');
const router = express.Router();

const {
    createPost,
    getPosts,
    getPostById,
} = require('../controllers/postController');

const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);

console.log(getPosts);
module.exports = router;