import React, { useState } from 'react'
import { Card, Tabs, Tooltip } from 'antd'
import { useHistory } from 'react-router-dom'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Laptop from '../../images/laptop.png'
import ProductListItems from './ProductListItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import { ShowAverage } from '../../utils/rating'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { addToWishlist } from '../../utils/user'
import { toast } from 'react-toastify'

const { TabPane } = Tabs
const { Meta } = Card

const SingleProduct = ({ product, onStarClickHandler, star }) => {
    const { title, images, description, _id } = product
    const [tooltip, setTooltip] = useState('Click to add')

    let history = useHistory()

    const dispatch = useDispatch()
    const { user, cart } = useSelector(state => ({ ...state }))

    const addToCartHandler = () => {
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
            localStorage.setItem('cart', JSON.stringify(unique))
            //Show tooltip
            setTooltip('Added')
            //Add to redux state
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

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
            console.log("ADDED TO WISHLIST", res.data);
            toast.success("Added to wishlist");
            history.push("/user/wishlist");
        });
    }

    return (
        <>
            <div className="col-md-7">
                {
                    images && images.length ? <Carousel emulateTouch autoPlay infiniteLoop stopOnHover useKeyboardArrows transitionTime={1000}>
                        {
                            images && images.map(i => {
                                return (
                                    <img key={i.public_id} src={i.url} alt="" />
                                )
                            })
                        }
                    </Carousel> :
                        <Card cover={
                            <img src={Laptop} alt="" className="mb-3 card-image" />
                        }>

                        </Card>
                }
                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Please contact us to learn more about this amazing new arrivals
                    </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>

                {product && product.ratings && product.ratings.length > 0
                    ? ShowAverage(product)
                    : <div className="text-center pt-1 pb-3">No rating yet</div>}

                <Card actions={[
                    <Tooltip title={tooltip}>
                        <a href onClick={addToCartHandler}>
                            <ShoppingCartOutlined className="text-danger" /> <br />Add to Cart
                                    </a>
                    </Tooltip>,
                    <a href onClick={addToWishlistHandler}>
                        <HeartOutlined className="text-info" /><br />
                        Add To Wishlist
                    </a>,
                    <RatingModal>
                        <StarRating
                            name={_id}
                            numberOfStarts={5}
                            rating={star}
                            changeRating={onStarClickHandler}
                            isSelectable={true}
                            starRatedColor="red" />
                    </RatingModal>
                ]}>
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    )
}

export default SingleProduct
