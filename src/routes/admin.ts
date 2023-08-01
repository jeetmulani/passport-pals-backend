"use strict"
import express, { Router } from 'express';
import { adminController } from '../controllers';
import * as validation from '../validation';
import { adminJWT } from '../helpers';
const router = express.Router();


// ------ admin auth Model -----------------
router.post('/signUp', adminController.signUp)
router.post('/login', validation?.login, adminController.login)


router.use(adminJWT);

// ----------  user Modal -------------

router.post('/get/user/with/pagination', adminController?.get_user_with_pagination)


// ---------  tour Model --------
router.post('/add/tour', validation?.add_tour, adminController?.add_tour)
router.get('/get/tour', adminController?.get_tour)
router.post('/get/tour/with/pagination', adminController?.get_tour_pagination)

// ---------  booking Model -------- 

router.get('/get/booking', adminController?.get_booking)
router.post('/get/booking/with/pagination', adminController?.get_booking_with_pagination)

// ---------  contact-us Modal ---------
router.post('/get/contactUs/with/pagination', adminController?.get_contactUs_with_pagination)

export const adminRouter = router;   