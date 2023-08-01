"use strict"
import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import { authRouter } from './auth'
import { adminRouter } from './admin'
import { userRouter } from './user'

const router = Router()

router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/user', userRouter)


export { router }