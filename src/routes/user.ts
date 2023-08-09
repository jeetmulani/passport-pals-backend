"use strict"
import express, { Router } from 'express';
import { userController } from '../controllers';
import * as validation from '../validation';
import { userJWT } from '../helpers';
const router = express.Router();


// router.use(userJWT);


//  ------------------ profile Model ----------------
router.get('/get_profile', userJWT, userController?.get_profile)
router.put('/update_profile', userJWT, validation.update_profile, userController?.update_profile)
router.post('/match_OldPssword', userJWT, validation.match_OldPssword, userController?.match_OldPssword)
router.post('/change_password', userJWT, validation.change_password, userController.change_password)


// ---------  tour Model -----------
router.get('/get/tour', userController?.get_tour)
router.get('/get/tour/:id', userController?.get_tour_by_id)

// --------- booking Modal ----------
router.post('/add/booking', userJWT, userController?.add_booking)

// --------- contactUs Modal  -----------
router.post('/add/contactUs', userJWT, validation?.add_contactUs, userController?.add_contactUs)


export const userRouter = router;