"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { tourModel } from '../../database/models'


export const add_tour = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body
        let response: any = await new tourModel(body).save()
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.addDataSuccess('tour'), response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.addDataError, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const get_tour = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let response: any = await tourModel.find({ isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('tour'), response, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('tour'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_tour_pagination = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let { page, limit, search } = req.body, skip = ((parseInt(page) - 1) * parseInt(limit)),
            match: any = {}
        if (search) {
            var locationArray: Array<any> = []
            var titleArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                locationArray.push({ location: { $regex: data, $options: 'si' } })
                titleArray.push({ title: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: locationArray }, { $and: titleArray }]
        }
        let response: any = await tourModel.aggregate([
            { $match: { isActive: true, ...match } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ])
        let tour_count: any = await tourModel.countDocuments({ isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('tour'), {
            response, state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(tour_count / (limit) as number)
            }
        }, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('tour'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}
