"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { apiResponse, userStatus } from '../../common'
import bcryptjs from 'bcryptjs'
import config from 'config'
import { Request, Response } from 'express'
import { responseMessage } from '../../helpers/response'
import { userModel } from '../../database/models'
import jwt from 'jsonwebtoken'
import { forgot_password_mail } from '../../helpers/index'

const jwt_token_secret: any = config.get('jwt_token_secret')
const refresh_jwt_token_secret: any = config.get('refresh_jwt_token_secret')


export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body
        let isAlready: any = await userModel.findOne({ email: body.email, isActive: true })
        if (isAlready) return res.status(409).json(await apiResponse(409, responseMessage.alreadyEmail, {}, {}));
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        let response: any = await new userModel(body).save()
        if (response) return res.status(200).json(await apiResponse(200, responseMessage.signupSuccess, response, {}));
        else return res.status(401).json(await apiResponse(401, responseMessage.signupError, {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body, otpFlag = 1, authToken: any
    try {
        for (let flag = 0; flag < 1;) {
            authToken = await Math.round(Math.random() * 1000000)
            if (authToken.toString().length == 6) {
                flag++
            }
        }
        let response = await userModel.findOne({ email: body.email, isActive: true }).select('-__v -createdAt -updatedAt')
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
            name: response?.name,
            email: response?.email,
            mobileNumber: response?.mobileNumber,
            token,
            refresh_token
        }
        return res.status(200).json(await await apiResponse(200, responseMessage.loginSuccess, response, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const forgot_password = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        otp = 0
    try {
        body.isActive = true
        let data = await userModel.findOne(body)

        if (!data) return res.status(400).json(await apiResponse(400, 'You have entered an email is not exist in database', {}, {}));
        if (data.isBlock == true) return res.status(403).json(await apiResponse(403, 'Account has been blocked', {}, {}));
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 10000)
                if (otp.toString().length == 4) {
                    flag++
                }
            }
            let isAlreadyAssign = await userModel.findOne({ otp: otp })
            if (isAlreadyAssign?.otp != otp) otpFlag = 0
        }
        let response = await forgot_password_mail(data, otp)
        if (response) {
            await userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(await apiResponse(200, `${response}`, data, {}));
        }
        else return res.status(501).json(await apiResponse(501, `Error in mail system`, {}, `${response}`));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, 'Internal Server Error', {}, error));
    }
}

export const resend_otp = async (req: Request, res: Response) => {
    reqInfo(req)
    let { email, } = req.body,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        otp = 0,
        response
    try {
        let data = await userModel.findOne({ email, isActive: true })
        if (!data) return res.status(400).json(await apiResponse(400, 'You have entered email is not exist in database', {}, {}));
        if (data.isBlock == true) return res.status(403).json(await apiResponse(403, 'Account has been blocked', {}, {}));
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 10000)
                if (otp.toString().length == 4) {
                    flag++
                }
            }
            let isAlreadyAssign = await userModel.findOne({ otp: otp })
            if (isAlreadyAssign?.otp != otp) otpFlag = 0
        }
        response = await forgot_password_mail(data, otp)
        if (response) {
            await userModel.findOneAndUpdate({ email, isActive: true }, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(await apiResponse(200, `${response}`, {}, {}));
        }
        else return res.status(501).json(await apiResponse(501, `Error in mail system`, {}, `${response}`));
    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, 'Internal Server Error', {}, {}))
    }
}

export const otp_verification = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        body.isActive = true
        let data = await userModel.findOneAndUpdate(body, { otp: null, otpExpireTime: null, authToken: body.otp })

        if (!data) return res.status(400).json(await apiResponse(400, 'Invalid otp ', {}, {}));
        if (data.isBlock == true) return res.status(403).json(await apiResponse(403, 'Account has been blocked', {}, {}));
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(await apiResponse(410, 'OTP is expired.', {}, {}));
        if (data) return res.status(200).json(await apiResponse(200, 'Otp verified successfully', { _id: data._id }, {}));
        else return res.status(501).json(await apiResponse(501, `Error in mail system`, {}, data));

    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, 'Internal Server Error', {}, error));
    }
}

export const reset_password = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        authToken = 0,
        email = body.email
    try {
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        delete body.email
        body.password = hashPassword

        for (let flag = 0; flag < 1;) {
            authToken = await Math.round(Math.random() * 1000000)
            if (authToken.toString().length == 6) {
                flag++
            }
        }
        body.authToken = authToken
        let response = await userModel.findOneAndUpdate({ email: email, isActive: true }, body)
        if (response) return res.status(200).json(await apiResponse(200, 'Password reset successfully', { action: "Please go to login page" }, {}));
        else return res.status(501).json(await apiResponse(501, `Something went wrong while Reseting the password!`, {}, response));

    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, 'Internal Server Error', {}, error));
    }
}