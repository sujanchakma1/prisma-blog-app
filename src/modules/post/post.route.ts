import express from 'express';
import { postController } from './post.controller';

const router = express.Router()

router.post('/',postController.createPost)
router.get('/',postController.getPost )

export const postRouter = router
