"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse } from '../../common'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { contactUsModel } from '../../database/models/index'


export const add_contactUs = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let user: any = req.header('user');
        let body = req.body
        body.createdBy = user._id
        let response = await new contactUsModel(body).save()
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.addDataSuccess('your message has been'), response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.addDataError, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}