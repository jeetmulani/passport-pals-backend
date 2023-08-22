"use strict"
import express, { Router } from 'express';
import { adminController } from '../controllers';
import * as validation from '../validation';
import { adminJWT } from '../helpers';
const router = express.Router();

