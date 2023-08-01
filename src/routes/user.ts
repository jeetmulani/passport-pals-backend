"use strict"
import express, { Router } from 'express';
import { userController } from '../controllers';
import * as validation from '../validation';
import { userJWT } from '../helpers';
const router = express.Router();


// router.use(userJWT);


//  ------------------ profile Model ----------------
router.get('/get_profile', userController?.get_profile)
router.put('/update_profile', validation.update_profile, userController?.update_profile)
router.post('/change_password', validation.change_password, userController.change_password)


// ---------  tour Model -----------
router.get('/get/tour', userController?.get_tour)

// --------- booking Modal ----------
router.post('/add/booking', userController?.add_booking)

// --------- contactUs Modal  -----------
router.post('/add/contactUs', validation?.add_contactUs, userController?.add_contactUs)


export const userRouter = router;   