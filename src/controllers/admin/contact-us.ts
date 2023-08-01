"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { contactUsModel } from '../../database/models'


export const get_contactUs_with_pagination = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let { page, limit, search } = req.body, skip = ((parseInt(page) - 1) * parseInt(limit)),
            match: any = {}
        if (search) {
            var nameArray: Array<any> = []
            var emailArray: Array<any> = []
            var mobileNumberArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                nameArray.push({ name: { $regex: data, $options: 'si' } })
                emailArray.push({ email: { $regex: data, $options: 'si' } })
                mobileNumberArray.push({ mobileNumber: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: nameArray }, { $and: emailArray }, { $and: mobileNumberArray }]
        }
        let response: any = await contactUsModel.aggregate([
            { $match: { date: { $lte: new Date() }, isActive: true }, ...match },
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
        let constactUs_count: any = await contactUsModel.countDocuments({ date: { $lte: new Date() }, isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('constactUs'), {
            response,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(constactUs_count / (limit) as number)
            }
        }, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('constactUs'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}