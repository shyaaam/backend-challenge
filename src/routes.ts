const JWT = require('jsonwebtoken')
const fetch = require('node-fetch')
const Joi = require('@hapi/joi')
const { salt, secret } = require('./config.js')

type VehicleData = {
    category: string,
    city_mileage: string,
    delivery_charges: string,
    doors: string,
    engine: string,
    engine_cylinders: string,
    engine_size: string,
    fuel_capacity: string,
    fuel_type: string,
    highway_mileage: string,
    invoice_price: string,
    made_in: string,
    made_in_city: string,
    make: string,
    manufacturer_suggested_retail_price: string,
    model: string,
    size: string,
    standard_seating: string,
    style: string,
    trim: string,
    type: string,
    vin: string,
    wheelbase_length: string,
    year: string
}

const routes = [
    {
        path: '/generate-token', // generate JWT route
        method: 'GET',
        config: {
            auth: false
        },
        handler: async () => {
            return {
                statusCode: 200,
                data: {
                    token: JWT.sign(salt, secret) // Just for demonstration! Usually the first param should be a random string
                }
            }
        }
    },
    {
        path: '/vin/{vin}',  // vin route
        method: 'GET',
        config: {
            validate: {
                params: Joi.object({
                    vin: Joi.string().min(17).max(17) // just a basic string length validation for vin, using Joi
                })
            }
        },
        handler: async (request: any, h: any) => {
            try {
                const data = await fetch('https://static.gapless.app/backend-coding-challenge/vins.json').then((res: any) => res.json())
                return {
                    statusCode: 200,
                    data: data.filter((d:VehicleData) => d.vin === request.params.vin)[0] || {}
                }
            }
            catch (e) {
                throw h.internal('Server Error', e)
            }
        }
    }
]

module.exports = routes
