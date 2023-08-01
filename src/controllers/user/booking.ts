"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { bookingModel } from '../../database/models/index'


export const add_booking = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let user: any = req.header('user');
        let body = req.body,
        booking_data: any = body.booking_data,
        response: any = []
        body.createdBy = user._id
        for (let i = 0; i < booking_data.length; i++) {
            response = response.push(new bookingModel(booking_data[i]).save())
        }
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.addDataSuccess('booking'), response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.addDataError, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}