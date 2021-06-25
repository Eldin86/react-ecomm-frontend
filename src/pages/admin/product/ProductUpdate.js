import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getProduct, updateProduct } from '../../../utils/product'
import { toast } from 'react-toastify'

import AdminNav from '../../../components/nav/AdminNav'
import FileUpload from '../../../components/forms/FileUpload'
import { getCategories, getCategorySubcategories } from '../../../utils/category'
import { LoadingOutlined } from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'

const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subcategories: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    //From colors user can pick one
    color: '',
    brand: ''
}


const ProductUpdate = ({ match, history }) => {
    const [values, setValues] = useState(initialState)
    const [subcategoryOptions, setSubcategoryOptions] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [arrayOfSubcategories, setArrayOfSubs] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => ({ ...state }))
    const { slug } = match.params

    useEffect(() => {
        loadProduct()
        loadCategories()
        console.log('arrayOfSubcategories', arrayOfSubcategories)
    }, [])

    const loadProduct = () => {
        getProduct(slug)
            .then(p => {
                console.log('single product -> subcategories', p.data.subcategories)
                //1. Load single product
                //Populate initialState spreading data
                setValues({ ...values, ...p.data })
                //2. Load single product category subcategories
                getCategorySubcategories(p.data.category._id)
                    .then(res => {
                        setSubcategoryOptions(res.data) //on first load, show default subcategories
                    })
                //3. Prepare array of id.s to show as default subcategorie values in antd Select
                let arr = []
                p.data.subcategories.map(s => {
                    console.log('s'.s)
                    return arr.push(s._id)
                })
                console.log('arr', arr)
                setArrayOfSubs(prev => arr) //required for antd design select option to work
            })
    }

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data));

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        //Update inputs value

        //Update values with subcategories and categories because they are not in values updated
        values.subcategories = arrayOfSubcategories
        console.log('arrayOfSubcategories', arrayOfSubcategories)
        //Selected categories will be there only if user try to update category else selectefCategory is empty
        values.category = selectedCategory ? selectedCategory : values.category

        updateProduct(slug, values, user.token)
            .then(res => {
                setLoading(false)
                toast.success(`${res.data.title} is updated`)
                history.push('/admin/products')
            })
            .catch(e => {
                setLoading(false)
                toast.error(e.response.data.error)
            })
    }

    const changeHandler = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const categoryChangeHandler = (e) => {
        e.preventDefault()
        console.log('CLICKED CATEGORY', e.target.value)
        setValues({ ...values, subcategories: [] });

        setSelectedCategory(e.target.value)

        getCategorySubcategories(e.target.value)
            //response sadrzi sve subkategorije koje pripadaju parent kategoriji
            .then(res => {
                console.log('res', res)
                setSubcategoryOptions(res.data)
            })
            .catch(e => {
                console.log('error', e)
            })

        console.log('CLICKED CATEGORY values.category', values.category)

        //If user clicks back to the original category 
        //Show its subcategories in default
        if (values.category._id === e.target.value) {
            //show existing categories that was already there
            loadProduct()
        }

        //When user wants to change category clear all subcategories
        setArrayOfSubs([])
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {/* {JSON.stringify(values)} */}
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product Update</h4>}

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading} />
                    </div>

                    <ProductUpdateForm
                        submitHandler={submitHandler}
                        changeHandler={changeHandler}
                        values={values}
                        setValues={setValues}
                        categoryChangeHandler={categoryChangeHandler}
                        categories={categories}
                        subcategoryOptions={subcategoryOptions}
                        arrayOfSubcategories={arrayOfSubcategories}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate