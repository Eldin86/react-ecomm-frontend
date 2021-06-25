import axios from 'axios'

export const createPaymentIntent = (authtoken, coupon) => 
//send Coupon true of false to calculate real price based on coupon if applied
    axios.post(`${process.env.REACT_APP_API}/create-payment-intent`, {couponApplied: coupon}, {
        headers: {
            authtoken
        }
    })
