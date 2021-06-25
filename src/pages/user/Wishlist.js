import React, { useState, useEffect } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getWishlist, removeWishlist } from '../../utils/user'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {DeleteOutlined} from '@ant-design/icons'

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([])
    const { user } = useSelector(state => ({ ...state }))
    const dispatch = useDispatch()

    useEffect(() => {
        loadWishlist()
    }, [])

    const loadWishlist = () => getWishlist(user.token)
        .then(res => {
            console.log('res.data.wishlist', res.data.wishlist)
            setWishlist(res.data.wishlist)
        })

    const removeHandler = (productId) => {
        removeWishlist(productId, user.token)
            .then(res => {
                loadWishlist(res.data.wishlist)
            })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h4>Wishlist</h4>
                    {
                        wishlist.map(p => {
                            return (
                                <div key={p._id} className="alert alert-secondary">
                                    <Link to={`/product/${p.slug}`}>
                                        {p.title}
                                    </Link>
                                    <span onClick={() => removeHandler(p._id)} className="btn btn-small float-right"><DeleteOutlined className="text-danger"/></span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Wishlist
