"use strict"
import * as Joi from "joi"
import { apiResponse } from '../common'
import { Request, Response } from 'express'


export const add_contactUs = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        name: Joi.string().error(new Error('name is string')),
        email: Joi.string().error(new Error('email is string')),
        mobileNumber: Joi.number().integer().min(1000000000).max(9999999999).error(new Error('mobileNumber is required!')),
        message: Joi.string().allow("", null).error(new Error('message is string')),
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(async error => {
        res.status(400).json(await apiResponse(400, error.message, {}, {}))
    })
}
