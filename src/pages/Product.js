import React, { useState, useEffect } from 'react'
import { getProduct, productStar } from '../utils/product'
import SingleProduct from '../components/cards/SingleProduct'
import { useSelector } from 'react-redux'
import {getRelated} from '../utils/product'
import ProductCard from '../components/cards/ProductCard'

const Product = ({ match }) => {
    const [product, setProduct] = useState({})
    const { slug } = match.params
    const [star, setStar] = useState(0)
    const [related, setRelated] = useState([])

    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadSingleProduct()
        //Load when slug changes
    }, [slug])

    useEffect(() => {
        console.log('outside if')
        if (product.ratings && user) {
            console.log('inside if')
            let existingRatingObject = product.ratings.find((element) => (element.postedBy.toString() === user._id.toString()))
            existingRatingObject && setStar(existingRatingObject.star) //current user's star
        }
    })

    const onStarClickHandler = (newRating, name) => {
        setStar(newRating)
        console.log(newRating, name)
        productStar(name, newRating, user.token)
            .then(res => {
                console.log('New rating clicked', res.data)
                //Show updated product when user rate product
                //Show updated rating in real time
                loadSingleProduct()
            })
    }

    const loadSingleProduct = () => {
        getProduct(slug).then(res => {
            setProduct(res.data)
            //load related products
            getRelated(res.data._id).then(res => setRelated(res.data))
        })
    }

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct product={product} onStarClickHandler={onStarClickHandler} star={star} />
            </div>
            <div className="row">
                <div className="col text-center py-5">
                    <hr />
                    <h4>Related Products</h4>
                    <hr />
                </div>
            </div>
            <div className="row pb-5">
                {related.length ? related.map((r) => <div className="col-md-4" key={r._id}>
                    <ProductCard product={r}/>
                </div>) : <div className="text-center col">No related products</div>}
            </div>
        </div>
    )

}

export default Product