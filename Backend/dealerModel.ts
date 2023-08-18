import mongoose, { Schema, Document, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'

export interface IDealer extends Document {
    _id: string
    name: string
    email: string
    login: string
    password: string
    phone_number: string
    google_id: string
    fb_id: string
    address: string
    logo: string
    reviews: string
    about_us: string
    postcode: string
    map_link: string
    links: {
        web_site: string
        facebook: string
        twitter: string
        youtube: string
    }
    role: string
    status: string
    coins: number
    loginMethod: number
    created_at: number
}

const dealerSchema = new Schema<IDealer>({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    login: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    phone_number: {
        type: String,
        // required: true
    },
    google_id: {
        type: String,
        default: ""
    },
    fb_id: {
        type: String,
        default: ""
    },
    address: {
        type: String
    },
    logo: {
        type: String
    },
    about_us: {
        type: String
    },
    postcode: {
        type: String
    },
    map_link: {
        type: String
    },
    links: {
        web_site: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        youtube: {
            type: String
        }
    },
    coins: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'dealer'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active'
    },
    created_at: {
        type: Number,
        default: Date.now
    },
    loginMethod: {
        type: Number,
        default: 1
    },
    reset_password_token: {
        type: String,
        default: null
    }
})

export default model<IDealer>('Dealer', dealerSchema)