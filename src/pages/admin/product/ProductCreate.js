import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { createProduct } from '../../../utils/product'
import { toast } from 'react-toastify'

import AdminNav from '../../../components/nav/AdminNav'
import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FileUpload'
import { getCategories, getCategorySubcategories } from '../../../utils/category'
import { LoadingOutlined } from '@ant-design/icons'

// const initialState = {
//     title: 'Mackbook Pro',
//     description: 'This is the best apple product',
//     price: '2400',
//     categories: [],
//     category: '',
//     subcategories: [],
//     shipping: 'Yes',
//     quantity: '50',
//     images: [],
//     colors: ["Black", "Brown", "Silver", "White", "Blue"],
//     brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "DELL"],
//     //From colors user can pick one
//     color: 'White',
//     brand: 'Apple'
// }

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subcategories: [],
    shipping: 'No',
    quantity: '1',
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: [],
    //From colors user can pick one
    color: '',
    brand: ''
}

const ProductCreate = () => {
    const [values, setValues] = useState(initialState)
    const [subcategoryOptions, setSubcategoryOptions] = useState([])
    const [showSubcategories, setShowSubcategories] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = () =>
        getCategories().then((c) => {
            let brands = []
            for (let o of c.data) {
                brands.push(o.name)
            }
            setValues({ ...values, categories: c.data, brands })
        });

    const submitHandler = (e) => {
        e.preventDefault()
        createProduct(values, user.token)
            .then(res => {
                //Nakon sto user klikne ok u alert boxu windows ce da se refreshuje tako da refreshujemo formu
                window.alert(`${res.data.title} is created`)
                window.location.reload()
            })
            .catch(e => {
                console.log(e)
                //if (e.response.status === 400) toast.error(e.response.data)
                toast.error(e.response.data.error)
            })
    }
    const changeHandler = (e) => {
        //Update inputs value
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    //zavisno o vrijednosti koju dobijemo mozemo da posaljemo drugi request i zato pisemo drugu funkciju
    // dohvatimo id i posaljemo u backend da bismo na osnovu njega dohvatili subkategorije

    const categoryChangeHandler = (e) => {
        e.preventDefault()
        console.log('CLICKED CATEGORY', e.target.value)
        setValues({ ...values, subcategories: [], category: e.target.value });
        getCategorySubcategories(e.target.value)
            //response sadrzi sve subkategorije koje pripadaju parent kategoriji
            .then(res => {
                //console.log('res', res)
                setSubcategoryOptions(res.data)
            })
            .catch(e => {
                console.log('error', e)
            })
        setShowSubcategories(true)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product Create</h4>}
                    <hr />

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading} />
                    </div>

                    <ProductCreateForm
                        values={values}
                        setValues={setValues}
                        submitHandler={submitHandler}
                        changeHandler={changeHandler}
                        categoryChangeHandler={categoryChangeHandler}
                        subcategoryOptions={subcategoryOptions}
                        showSubcategories={showSubcategories} />
                </div>
            </div>
        </div>
    )
}

export default ProductCreate