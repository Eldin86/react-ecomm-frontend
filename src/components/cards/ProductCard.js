import React, { useState } from 'react'
import { Card, Tooltip } from 'antd'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'
import { ShowAverage } from '../../utils/rating'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'

const { Meta } = Card

const ProductCard = ({ product }) => {
    const { images, title, description, slug, price } = product
    const [tooltip, setTooltip] = useState('Click to add')

    const dispatch = useDispatch()
    const { user, cart } = useSelector(state => ({ ...state }))

    const addToCartHandler = () => {

        if (product.quantity < 1) {
            return;
        }
        //create cart array
        let cart = []
        if (typeof window !== 'undefined') {
            console.log(product)
            //If cart is in localStorage get it
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            //Push new product to cart
            cart.push({
                ...product,
                count: 1
            })
            //Remove duplicates using lodash npm package
            let unique = _.uniqWith(cart, _.isEqual)
            //Save to localStorage
            //At the same time we add product to localStorage and to redux
            localStorage.setItem('cart', JSON.stringify(unique))
            //Show tooltip
            setTooltip('Added')
            //Add to redux state
            //At the same time we add product to localStorage and to redux
            dispatch({
                type: 'ADD_TO_CART',
                payload: unique
            })
            //Show cart items in sidedrawer
            dispatch({
                type: "SET_VISIBLE",
                payload: true
            })
        }
    }

    return (
        <>
            {product && product.ratings && product.ratings.length > 0
                ? ShowAverage(product)
                : <div className="text-center pt-1 pb-3">No rating yet</div>}
            <Card
                cover={
                    <img src={images && images.length ? images[0].url : Laptop} style={{ height: "140px", objectFit: "cover" }} alt={title} className="p-1" />
                }
                actions={
                    [
                        <Link to={`/product/${slug}`}>
                            <EyeOutlined className="text-warning" /> <br />View Product
                    </Link>,
                        <Tooltip title={tooltip}>
                            <a href onClick={addToCartHandler} disabled={product.quantity < 1}>
                                <ShoppingCartOutlined className="text-danger" /> <br />
                                {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
                    </a>
                        </Tooltip>
                    ]
                }>
                {product.title}
                <Meta title={`${title} - $${price}`} description={`${description && description.substring(0, 40)}...`} />
            </Card>
        </>
    )
}

export default ProductCard
