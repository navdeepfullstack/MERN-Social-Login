import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import sharp from 'sharp'
// import { unlink } from 'fs/promises'
import { unlink } from 'fs'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'
import sgMail from '@sendgrid/mail'
import config from "../config/config"
const nodemailer = require('nodemailer');


const SENDGRID_API = config.SENDGRID_API

function makeid(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
export class DealerController {


    socialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let orArr = [];

        req.body.google_id && orArr.push({ 'google_id': req.body.google_id })
        req.body.fb_id && orArr.push({ 'fb_id': req.body.fb_id })
        req.body.email && orArr.push({ 'email': req.body.email })

        let ifExists = await storage.dealer.findOneUsingSocialId({
            $or: orArr
        })

        let token = ''
        let newDealer
        if (ifExists) {
            let updateBody: any = {
                ...(req.body.name ? { name: req.body.name } : {}),
                ...(req.body.google_id ? { google_id: req.body.google_id } : {}),
                ...(req.body.fb_id ? { 'fb_id': req.body.fb_id } : {}),
                ...(req.body.picture ? { logo: req.body.picture } : {}),
                loginMethod: req.body.loginMethod
            }
            await storage.dealer.update(ifExists._id, updateBody)
            token = await signToken(ifExists.id, req.body.role)
        }
        else {
            let body: any = {
                email: req.body.email,
                ...(req.body.name ? { name: req.body.name } : {}),
                login: req.body.email,
                ...(req.body.picture ? { logo: req.body.picture } : {}),
                ...(req.body.google_id ? { google_id: req.body.google_id } : {}),
                ...(req.body.fb_id ? { 'fb_id': req.body.fb_id } : {}),
                loginMethod: req.body.loginMethod,
                role: req.body.role
            }
            newDealer = await storage.dealer.create(body)
            token = await signToken(newDealer.id, req.body.role)
        }

        return res.status(201).json({
            success: true,
            data: {
                newDealer: ifExists ? ifExists : newDealer,
                token
            }
        })
    })

}
