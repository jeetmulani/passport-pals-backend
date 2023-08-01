"use strict"
import * as Joi from "joi"
import { apiResponse } from '../common'
import { Request, Response } from 'express'

export const add_tour = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        image: Joi.string().required().error(new Error('image is required!')),
        rating: Joi.number().max(5).required().error(new Error('rating is required! & max length is 5')),
        location: Joi.string().required().error(new Error('location is required!')),
        title: Joi.string().required().error(new Error('title is required!')),
        description: Joi.string().required().error(new Error('description is required!')),
        days: Joi.number().required().error(new Error('days is required!')),
        night: Joi.number().required().error(new Error('night is required!')),
        price: Joi.number().required().error(new Error('price is required!')),
    })
    schema.validateAsync(req.body).then(async result => {
        req.body = result
        return next()
    }).catch(async error => {
        res.status(400).json(await apiResponse(400, error.message, {}, {}));
    })

}