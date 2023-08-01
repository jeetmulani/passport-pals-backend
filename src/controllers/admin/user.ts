"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse, userStatus } from '../../common'
import bcryptjs from 'bcryptjs'
import config from 'config'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { adminModel, userModel } from '../../database/models'
import jwt from 'jsonwebtoken'

const jwt_token_secret: any = config.get('jwt_token_secret')
const refresh_jwt_token_secret: any = config.get('refresh_jwt_token_secret')


export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        let response: any = await new adminModel(body).save()
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.signupSuccess, response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.signupError, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body, authToken: any
    try {
        for (let flag = 0; flag < 1;) {
            authToken = await Math.round(Math.random() * 1000000)
            if (authToken.toString().length == 6) {
                flag++
            }
        }
        console.log("body.emnail", body?.email);

        let response: any = await adminModel.findOne({ isActive: true, email: body?.email })
        console.log("rfesponese ", response);

        if (!response) return res.status(400).json(await apiResponse(400, responseMessage.invalidUserEmail, {}, {}));
        if (response?.isBlock == true) return res.status(403).json(await apiResponse(403, 'Your account han been blocked.', {}, {}));
        const passwordMatch = await bcryptjs.compare(body.password, response.password)

        if (!passwordMatch) return res.status(400).json(await apiResponse(400, responseMessage.invalidUserPassword, {}, {}));
        const token = jwt.sign({
            _id: response._id,
            authToken: response.authToken,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret)
        const refresh_token = jwt.sign({
            _id: response._id,
            generatedOn: (new Date().getTime())
        }, refresh_jwt_token_secret)
        response = {
            _id: response?._id,
            email: response?.email,
            token,
            refresh_token
        }
        return res.status(200).json(await await apiResponse(200, responseMessage.loginSuccess, response, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const get_user_with_pagination = async (req: Request, res: Response) => {
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
        let response: any = await userModel.aggregate([
            { $match: { isActive: true, isBlock: false, ...match } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ])
        let user_count: any = await userModel.countDocuments({ isActive: true, isBlock: false })
        if (response) return res.status(200).json(await apiResponse(200, responseMessage?.getDataSuccess('user'), {
            response,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(user_count / (limit) as number)
            }
        }, {}))
        else return res.status(404).json(await apiResponse(404, responseMessage?.getDataNotFound('user'), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}