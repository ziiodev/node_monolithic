const CustomerService = require('../services/customer-service.js')
//const UserAuth = require('./middlewares(auth')

module.exports = (app) => {
  const service = new CustomerService()

  app.post('/customer/signup', async (req, res, next) => {
    try {
      const { email, password, phone } = req.body
      const { data } = await service.SignUp({ email, password, phone })
      return res.json(data)
    } catch (err) {
      next(err)
    }
  })
}