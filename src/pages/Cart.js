import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { userCart } from '../utils/user'

import ProductCartInCheckout from '../components/cards/ProductCartInCheckout'

const Cart = ({ history }) => {
    const { cart, user } = useSelector(state => ({ ...state }))
    const dispatch = useDispatch()


    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const saveOrderToDb = () => {
        //endpoint to save cart to backend
        userCart(cart, user.token)
            .then(res => {
                console.log('CART POST RES', res)
                //ako smo uspjesno spremili cart u backend onda cemo dobiti res.data.ok
                if (res.data.ok) {
                    history.push('/checkout')
                }
            })
            .catch(e => {
                console.log('Cart save error', e)
            })
        setTimeout(() => {
            history.push('/checkout')
        }, 500)
    }

    const showCartItems = () => {
        return <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            {
                cart.map(p => (
                    <ProductCartInCheckout key={p._id} p={p} />
                ))
            }
        </table>
    }

    const saveCashOrderToDb = () => {
        //endpoint to save cart to backend
        dispatch({
            type: 'CASH_ON_DELIVERY', 
            payload: true
        })
        userCart(cart, user.token)
            .then(res => {
                //ako smo uspjesno spremili cart u backend onda cemo dobiti res.data.ok
                if (res.data.ok) {
                    history.push('/checkout')
                }
            })
            .catch(e => {
                console.log('Cart save error', e)
            })
        setTimeout(() => {
            history.push('/checkout')
        }, 500)
    }

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                <div className="col-md-8">
                    <h4>Cart / {cart.length} {cart.length > 1 ? ' products' : 'product'}</h4>
                    {
                        !cart.length
                            ? <p>No products in cart. <Link to="/shop">Continue Shopping</Link></p>
                            : showCartItems()
                    }
                </div>
                <div className="col-md-4">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>{c.title} x {c.count} = ${c.count * c.price}</p>
                        </div>
                    ))}
                    <hr />
                    Total: <b>${getTotal()}</b>
                    <hr />
                    {
                        //If we have logged in user
                        user ? (
                            //Sent cart to backend and save under registered user
                            //Disabled if no items in cart
                            <>
                                <button
                                    onClick={saveOrderToDb}
                                    disabled={!cart.length}
                                    className="btn btn-sm btn-primary mt-2">
                                    Proceed to Checkout</button>
                                <br />
                                <button
                                    onClick={saveCashOrderToDb}
                                    disabled={!cart.length}
                                    className="btn btn-sm btn-warning mt-2">
                                    Pay Cash on Delivery</button>
                            </>
                        ) : (
                            <button className="btn btn-sm btn-primary mt-2">
                                <Link to={{
                                    pathname: '/login',
                                    state: {
                                        //posaljemo ga na login page i dodamo u state property from koji pretstavlja cart page odnosno page sa kojeg smo ga redirectali na login
                                        from: 'cart'
                                    }
                                }}>
                                    Login to Checkout
                                </Link>
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart
