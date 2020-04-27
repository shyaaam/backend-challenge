// @ts-ignore
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

chai.use(chaiHttp)

/*
* Test the /generate-token route
*/
// eslint-disable-next-line no-undef
describe('/GET generate-token', () => {
    it('should generate jwt token', done => {
        chai.request(require('../src/index.ts'))
            .get('/generate-token')
            .end((err:any, res:any) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
            })
            .done()
    })
})
