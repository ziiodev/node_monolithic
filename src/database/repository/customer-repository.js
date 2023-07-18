const { CustomerModel, AddressModel } = require('../models')
const {
  APIError,
  BadRequest,
  STATUS_CODE
} = require('../../utils/app-errors')

class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        salt,
        phone,
        address: []
      })
      const customerResult = await customer.save()
      return customerResult
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Unable to create customer'
      )
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email })
      return existingCustomer
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Unable to Find customer'
      )
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id)
      if (profile) {
        const newAddress = AddressModel({
          street,
          postalCode,
          city,
          country
        })
        await newAddress.save()
        profile.address.push(newAddress)
      }
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Error on create address'
      )
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingCustomer = await CustomerModel.findById(id)
        .populate('address')
      return existingCustomer
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Unable to Find customer'
      )
    }
  }

  async AddCartItem(customerId, product, qty, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart.product")
      if (profile) {
        const cartItem = {
          product,
          unit: qty
        }
        let cartItems = profile.cart
        if (cartItems.email > 0) {
          let isExist = false
          cartItems.map((item) => {
            if (item.product._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOd(item), 1)
              } else {
                item.unit = qty
              }
              isExist = true
            }
          })
          if (!isExist) {
            cartItems.push(cartItem)
          }
        } else {
          cartItems.push(cartItem)
        }
        profile.cart = cartItems
        const cartSaveResult = await profile.save()
        return cartSaveResult.cart
      }
      throw new Error('Unable to add to cart!')
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Unable to Add product to cart'
      )
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId)
      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = []
        }
        profile.orders.push(order)
        profile.cart = []
        const profileResult = await profile.save()
        return profileResult
      }
      throw new Error('Unable to Add to order')
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODE.INTERNAL_ERROR,
        'Unable to add order'
      )
    }
  }
}

module.exports = CustomerRepository