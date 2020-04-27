export {}
const chai = require('chai')
const chaiHttp = require('chai-http')
const Server = require('../src/server.ts')
const { host, port } = require('../src/config')
chai.should()

chai.use(chaiHttp)

type ServerType = { init: any, inject: any }
type ResponseBody = {
    statusCode: string,
    data: object
}

const API_PREFIX = `http://${host}:${port}`
const vin = '2G1FK3DJ0C9179670'
const token = 'eyJhbGciOiJIUzI1NiJ9.c0htcFR6cVhNcDhQcFlYS3djOVNoUTFVaHlEZQ.ggEl-gwRBdfn8zGCQMziawbV8Nuf3hsNRleUAgH_CIs'


/*
* Test the /generate-token route
*/
// eslint-disable-next-line no-undef
describe('api test suite', () => {
    let server: ServerType
    // eslint-disable-next-line no-undef
    before(done => {
        Server.init().then((s: ServerType) => {
            server = s
            done()
        })
    })

    describe('/GET generate-token', () => {
        it('it should generate a jwt token', async () => {
            const res = await server.inject({
                url: API_PREFIX + '/generate-token',
            })
            const body: ResponseBody = JSON.parse(res.payload)
            res.statusCode.should.be.equal(200)
            body.should.be.a('object')
            body.should.have.property('statusCode')
            body.should.have.property('data')
                .that.has.property('token')
        })
    })

    describe('/GET vin', () => {
        it('it should show vehicle details for valid vin and valid jwt', async () => {
            const res = await server.inject({
                url: `${API_PREFIX}/vin/${vin}?token=${token}`,
            })
            const body: ResponseBody = JSON.parse(res.payload)
            res.statusCode.should.be.equal(200)
            body.should.be.a('object')
            body.should.have.property('statusCode')
            body.should.have.property('data')
                .that.have.keys(['category', 'city_mileage', 'delivery_charges', 'doors', 'engine', 'engine_cylinders', 'engine_size', 'fuel_capacity', 'fuel_type', 'highway_mileage', 'invoice_price', 'made_in', 'made_in_city', 'make', 'manufacturer_suggested_retail_price', 'model', 'size', 'standard_seating', 'style', 'trim', 'type', 'vin', 'wheelbase_length', 'year'])
        })

        it('it should not show vehicle details for incorrect vin string length', async () => {
            const res = await server.inject({
                url: `${API_PREFIX}/vin/${vin}10?token=${token}`,
            })
            const body: ResponseBody = JSON.parse(res.payload)
            res.statusCode.should.be.equal(400)
            body.should.be.a('object')
            body.should.have.property('statusCode').equal(400)
            body.should.have.property('error').equal('Bad Request')
            body.should.have.property('message').equal('Invalid request params input')
        })

        it('it should not show vehicle details for unauthorized users (corrupt/missing jwt)', async () => {
            const res = await server.inject({
                url: `${API_PREFIX}/vin/${vin}10?token=`,
            })
            const body: ResponseBody = JSON.parse(res.payload)
            res.statusCode.should.be.equal(401)
            body.should.be.a('object')
            body.should.have.property('statusCode').equal(401)
            body.should.have.property('error').equal('Unauthorized')
            body.should.have.property('message').equal('Missing authentication')
        })
    })
})
