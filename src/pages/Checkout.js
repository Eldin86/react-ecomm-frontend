import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    getUserCart,
    emptyUserCart,
    saveUserAddress,
    applyCoupon,
    createCashOrderForUser
} from '../utils/user'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([])
    const [address, setAddress] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [total, setTotal] = useState(0)
    const [coupon, setCoupon] = useState('')
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [discountError, setDiscountError] = useState('')

    const dispatch = useDispatch()
    const { user, COD } = useSelector(state => ({ ...state }))
    //Named like this because naming conflict with useState coupon variable
    const couponTrueOrFalse = useSelector(state => (state.coupon))

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            console.log("user cart res", JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const saveAddressToDb = () => {
        saveUserAddress(address, user.token)
            .then(res => {
                if (res.data.ok) {
                    setAddressSaved(true)
                    toast.success('Address Saved')
                }
            })
    }

    const emptyCartHandler = () => {
        //empty from localStorage
        if (typeof window !== "undefined") {
            localStorage.removeItem('cart')
        }
        //Remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: []
        })
        //Remove from backend
        emptyUserCart(user.token)
            .then(res => {
                setProducts([])
                setTotal(0)
                //After empty cart reset setTotalAfterDiscount and setCoupon
                setTotalAfterDiscount(0)
                setCoupon('')
                toast.success('Cart is empty. Continue shopping')
            })
    }

    const showAddress = () => {
        return (
            <>
                <ReactQuill theme="snow" value={address} onChange={setAddress} />
                <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>Save</button>
            </>
        )
    }

    const showProductSummary = () => {
        return products.map((p, i) => {
            return (
                <div key={i}>
                    <p>{p.product.title} ({p.color}) x {p.count} = {p.price * p.count}</p>
                </div>
            )
        })

    }

    const applyDiscountCoupon = () => {
        console.log('coupon to backend', coupon)
        //apply coupon
        applyCoupon(coupon, user.token)
            .then(res => {
                console.log('Response on Coupon applied', res.data)
                if (res.data) {
                    setTotalAfterDiscount(res.data)
                    //update redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true
                    })
                }
                //error
                if (res.data.err) {
                    setDiscountError(res.data.err)
                    //update redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false
                    })
                }
            })
    }

    const showApplyCoupon = () => (
        <>
            <input type="text" className="form-control" onChange={e => {
                setCoupon(e.target.value)
                //Clear error message after user type new values in input
                setDiscountError('')
            }} value={coupon} />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
        </>
    )

    //If clicked to pay with cash on delivery button
    const createCashOrder = () => {
        //ako je COD true kreiramo order sa statusom Cash On Delivery
        createCashOrderForUser(user.token, COD, couponTrueOrFalse)
            .then(res => {
                console.log('USER CASH ORDER CREATED RESPONSE', res)
                //empty cart from redux, local storage, reset coupon, reset COD, redirect
                if (res.data.ok) {
                    //Empty localStorage
                    if (typeof window !== 'undefined') localStorage.removeItem('cart')
                    //empty redux cart
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: []
                    })

                    //empty redux coupon
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false
                    })
                    //empty redux COD
                    dispatch({
                        type: "COD",
                        payload: false
                    })

                    //Empty cart from backend
                    emptyUserCart(user.token)
                    //redirect
                    //wait few ms because of code before needs time to execute
                    setTimeout(() => {
                        history.push('/user/history')
                    }, 1000)
                }
            })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                <br />
                {showApplyCoupon()}
                <br />
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {showProductSummary()}

                <hr />
                <p>Cart Total: ${total}</p>
                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">
                        Discount Applied: Total Payable: ${totalAfterDiscount}
                    </p>
                )}
                <div className="row">
                    <div className="col-md-6">
                        {
                            COD ? (
                                <button
                                    disabled={!addressSaved || !products.length}
                                    className="btn btn-primary"
                                    onClick={createCashOrder}>Place Order</button>
                            ) : (
                                <button
                                    disabled={!addressSaved || !products.length}
                                    className="btn btn-primary"
                                    onClick={() => history.push('/payment')}>Place Order</button>
                            )
                        }
                    </div>
                    <div className="col-md-6">
                        <button onClick={emptyCartHandler} disabled={!products.length} className="btn btn-primary">Empty Cart</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Checkout
