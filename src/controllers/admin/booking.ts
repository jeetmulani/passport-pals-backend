"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { bookingModel } from '../../database/models'


export const get_booking = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let response: any = await bookingModel.find({ date: { $lte: new Date() }, isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('booking'), response, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('booking'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_booking_with_pagination = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let { page, limit, search } = req.body, skip = ((parseInt(page) - 1) * parseInt(limit)),
            match: any = {}
        if (search) {
            var firstNameArray: Array<any> = []
            var lastNameArray: Array<any> = []
            var emailArray: Array<any> = []
            var phoneNumberArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                firstNameArray.push({ firstName: { $regex: data, $options: 'si' } })
                lastNameArray.push({ lastName: { $regex: data, $options: 'si' } })
                emailArray.push({ email: { $regex: data, $options: 'si' } })
                phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: firstNameArray }, { $and: lastNameArray }, { $and: emailArray }, { $and: phoneNumberArray }]
        }
        let response: any = await bookingModel.aggregate([
            { $match: { date: { $lte: new Date() }, isActive: true, ...match } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    let: { userId: '$createdBy' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$userId'] },
                                        { $eq: ['$isActive', true] },
                                    ],
                                },
                            }
                        },
                    ],
                    as: "user_data"
                }
            },
            { $skip: skip },
            { $limit: limit },
        ])
        let booking_count: any = await bookingModel.countDocuments({ date: { $lte: new Date() }, isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('booking'), {
            response,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(booking_count / (limit) as number)
            }
        }, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('booking'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}