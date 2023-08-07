"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { tourModel } from '../../database/models'


export const get_tour = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        // let body = req.body
        let response: any = await tourModel.find({ isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.getDataSuccess('tour'), response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.getDataNotFound, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const get_tour_by_id = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let tourId = req.params.id
        let response: any = await tourModel.find({ _id: tourId, isActive: true })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.getDataSuccess('tour'), response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.getDataNotFound, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}
