import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { getProductsByCount } from '../../../utils/product'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import { removeProduct } from '../../../utils/product'
import {useSelector} from 'react-redux'
import { toast } from 'react-toastify'

const AllProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const {user} = useSelector(state => ({...state}))

    useEffect(() => {
        loadAllProducts()
    }, [])

    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(55)
            .then(res => {
                console.log('products res', res.data)
                setProducts(res.data)
                setLoading(false)
            })
            .catch(e => {
                setLoading(false)
            })
    }

    const removeHandler = (slug) => {
        console.log(slug)
        if(window.confirm('Delete?')){
            removeProduct(slug, user.token)
                .then(res => {
                    console.log(res)
                    loadAllProducts()
                    setLoading(false)
                    toast.error(`${res.data.title} is deleted.`)
                })
                .catch(e => {
                    console.log(e)
                    setLoading(false)
                    if(e.response.status === 400) toast.error(e.response.data)
                })
        }
    } 

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (<h4 className="text-danger">Loading...</h4>) : (<h4>All Products</h4>)}
                    <div className="row">
                        {products.map(product => {
                            return (
                                <div key={product._id} className="col-md-4 pb-3">
                                    <AdminProductCard product={product} removeHandler={removeHandler}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProducts