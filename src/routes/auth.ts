"use strict"
import express, { Router } from 'express';
import { authController } from '../controllers';
import * as validation from '../validation';
const router = express.Router();


router.post('/signUp', validation?.signUp, authController.signU
