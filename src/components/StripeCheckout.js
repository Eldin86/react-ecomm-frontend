import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { createPaymentIntent } from '../utils/stripe'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import Laptop from '../images/laptop.png'
import Checkout from '../pages/Checkout'
import {createOrder, emptyUserCart} from '../utils/user'

const cartStyle = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#32325d",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

const StripeCheckout = ({ history }) => {

    const { user, coupon } = useSelector(state => ({ ...state }))
    const dispatch = useDispatch()

    const [succeeded, setSucceeded] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [clientSecret, setClientSecret] = useState('')
    const [cartTotal, setCartTotal] = useState(0)
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [payable, setPayable] = useState(0)

    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        createPaymentIntent(user.token, coupon)
            .then(res => {
                console.log('create payment intent', res.data)
                setClientSecret(res.data.clientSecret)
                //additional response recived on successuful payment
                setCartTotal(res.data.cartTotal)
                setTotalAfterDiscount(res.data.totalAfterDiscount)
                setPayable(res.data.payable)
            })
        console.log('coupon', coupon)
    }, [coupon])
    //Handler to confirm card payment
    const submitHandler = async (e) => {
        e.preventDefault()
        setProcessing(true)
        //confirm card payment
        //we get from backend clientSecret then send it to confirmCardPayment method
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: e.target.value
                }
            },
        })
        //Check if payload method has error or it is success
        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`)
            setProcessing(false)
        } else {
            console.log(payload)
            createOrder(payload, user.token)
                .then(res => {
                    if(res.data.ok){
                        //empty cart from localStorage
                        if(typeof window !== 'undefined') localStorage.removeItem('cart')
                        //empty from redux
                        dispatch({
                            type: "ADD_TO_CART",
                            payload: []
                        })
                        //reset coupon to false
                        dispatch({
                            type: "COUPON_APPLIED",
                            payload: false
                        })
                        //empty cart from database
                        emptyUserCart(user.token)
                    }
                })
            //Here get result after successuful payment
            //Create order and save in database for admin process
            //empty user cart from redux store and localStorage
            setError(null)
            setProcessing(false)
            setSucceeded(true)
        }
    }

    const changeHandler = async (e) => {
        //Listen for changes in card element
        //and display any errors as the customer types their card details
        setDisabled(e.empty)//validate payment form input
        setError(e.error ? e.error.message : "") //Show error message
    }

    return (
        <>
            {
                !succeeded && <div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className="alert alert-success">{`Total after discount: $${totalAfterDiscount}`}</p>
                    ) : (
                        <p className="alert alert-danger">No coupon applied</p>
                    )}
                </div>
            }
            <div className="text-center pb-5">
                <Card
                    cover={<img alt="Laptop placeholder" src={Laptop}
                        style={{ height: '200px', objectFit: 'cover', marginBottom: '-15px' }} />}
                    actions={[
                        <>
                            <DollarOutlined className="text-info" /> <br /> Total: ${cartTotal}
                        </>,
                        <>
                            <CheckOutlined className="text-info" /> <br /> Total payable: ${(payable / 100).toFixed(2)}
                        </>
                    ]} />
            </div>

            <form id="payment-form" className="stripe-form" onSubmit={submitHandler}>
                <CardElement id="card-element" options={cartStyle} onChange={changeHandler} />
                <button className="stripe-button" disabled={processing || disabled || succeeded}>
                    <span id="button-text">
                        {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
                    </span>
                </button>
                <br />
                {error && <div className="card-error" role="alert">{error}</div>}
                <br />
                <p className={succeeded ? 'result-message' : 'result-message hidden'}>
                    Payment Successuful. <Link to="/user/history">See it in your purchase history.</Link>
                </p>
            </form>
        </>
    )
}

export default StripeCheckout
