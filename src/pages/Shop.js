import React, { useState, useEffect } from 'react'
import { getProductsByCount, fetchProductsByFilter } from '../utils/product'
import { getCategories } from '../utils/category'
import { getSubcategories } from '../utils/subcategory'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'
import { Menu, Slider, Checkbox, Radio } from 'antd'
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons'
import Star from '../components/forms/Star'

const { SubMenu } = Menu

const Shop = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    //Default values for price range slider
    const [price, setPrice] = useState([0, 0])
    const [ok, setOk] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [star, setStar] = useState('')
    const [subcategories, setSubcategories] = useState([])
    const [subcategory, setSubcategory] = useState('')
    //Because in DB we have fixed values
    const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "DELL", "ACER"])
    const [brand, setBrand] = useState('')
    const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue"])
    const [color, setColor] = useState('')

    const [shipping, setShipping] = useState('')

    let { search } = useSelector(state => ({ ...state }))
    const { text } = search
    let dispatch = useDispatch()

    //1. load products by default on page load
    const loadAllProducts = () => {
        setLoading(true)
        //Show 12 products as default on shop page
        getProductsByCount(12)
            .then(res => {
                //console.log('res.data products', res.data)
                setProducts(res.data)
                setLoading(false)
            })
    }
    useEffect(() => {
        loadAllProducts()

        //Fetch categories
        getCategories()
            .then(res => {
                setCategories(res.data)
            })
        //fetch subcategories
        getSubcategories()
            .then(res => {
                setSubcategories(res.data)
            })
    }, [])


    //2. load products on user search input
    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
            .then(res => {
                console.log(res.data)
                setProducts(res.data)
            })
    }
    useEffect(() => {
        //Delayed query request
        const delayed = setTimeout(() => {
            //Controller expects object which is destructured
            fetchProducts({ query: text })
            if(!text){
                loadAllProducts()
            }
        }, 300)

        return () => clearTimeout(delayed)

    }, [text])

    //3. Load products based on price range
    const sliderHandler = (value) => {
        //When user starts to use slider we want to empty search bar input field, clear text
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setBrand('')
        setShipping('')
        //Reset
        setCategoryIds([])
        //value is array of prices, lowest and highest
        setPrice(value)
        setStar('')
        //Clear subcategories filter
        setSubcategory('')
        //Delay requests to backend
        setColor('')
        setTimeout(() => {
            //On every 300ms change ok value when slider is in use so can useEffect run
            //Toggle ok value
            setOk(!ok)
        }, 300)
    }
    useEffect(() => {
        console.log('ok to request')
        fetchProducts({ price })
    }, [ok])

    //4. Load products based on category
    //show categories in a list of checkbox
    //Check handler for category
    const checkHandler = (e) => {
        //Reset input search 
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setBrand('')
        //Reset price range
        setPrice([0, 0])
        //Clear subcategories filter
        setSubcategory('')
        //Reset star filter
        setStar('')
        setColor('')
        setShipping('')
        //console.log(e.target.value)
        let inTheState = [...categoryIds]
        let justChecked = e.target.value
        let foundInTheState = inTheState.indexOf(justChecked)

        //indexOf method if not found returns -1 else return index
        //Check for duplicates
        if (foundInTheState === -1) {
            inTheState.push(justChecked)
        } else {
            //if found pull out item fron index
            inTheState.splice(foundInTheState, 1)
        }

        setCategoryIds(inTheState)
        //console.log('inTheState', inTheState)
        fetchProducts({ category: inTheState })
    }
    const showCategories = () => categories.map((c) => (
        <div key={c._id}>
            <Checkbox checked={categoryIds.includes(c._id)} onChange={checkHandler} className="pb-2 pl-4 pr-4" value={c._id} name="category">{c.name}</Checkbox>
            <br />
        </div>
    ))


    //5. Show products based on star rating
    const starClickHandler = (num) => {
        console.log(num)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        //Clear subcategories filter
        setSubcategory('')
        setPrice([0, 0])
        setBrand('')
        setCategoryIds([])
        setStar(num)
        setColor('')
        setShipping('')
        fetchProducts({ stars: num })
    }
    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={starClickHandler} numberOfStars={5} />
            <Star starClick={starClickHandler} numberOfStars={4} />
            <Star starClick={starClickHandler} numberOfStars={3} />
            <Star starClick={starClickHandler} numberOfStars={2} />
            <Star starClick={starClickHandler} numberOfStars={1} />
        </div>
    )

    //6. Show products by subcategories
    const subcategoryHandler = (subcategory) => {
        //console.log("sub", subcategorie)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setColor('')
        setShipping('')
        setSubcategory(subcategory)
        fetchProducts({ subcategory })
    }
    const showSubcategories = () => subcategories.map(s => <div
        key={s._id}
        onClick={() => subcategoryHandler(s)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: 'pointer' }}>
        {s.name}
    </div>
    )

    //7. Show products based on brand name
    const brandHandler = (e) => {
        setSubcategory('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setColor('')
        setShipping('')
        setBrand(e.target.value)
        fetchProducts({ brand: e.target.value })
    }
    const showBrands = () => brands.map(b => <>
        <Radio
            value={b}
            name={b}
            checked={b === brand}
            onChange={brandHandler}
            className="pb-1 pl-4 pr-4">
            {b}
        </Radio>
        <br />
    </>)

    //8. Show products based on color
    const colorHandler = (e) => {
        setSubcategory('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setShipping('')
        setColor(e.target.value)
        fetchProducts({ color: e.target.value })
    }
    const showColors = () => colors.map(c => <>
        <Radio
            value={c}
            name={c}
            checked={c === color}
            onChange={colorHandler}
            className="pb-1 pl-4 pr-4">
            {c}
        </Radio>
        <br />
    </>)

    //9. show products based on shipping "Yes" :  "No"
    const shippingChangeHandler = (e) => {
        setSubcategory('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setColor('')
        setShipping(e.target.value)
        fetchProducts({ shipping: e.target.value })
    }
    const showShipping = () => {
        return <>
            <Checkbox className="pb-2 pl-4 pr-4" onChange={shippingChangeHandler} value="Yes" checked={shipping=== "Yes"}>Yes</Checkbox>
            <Checkbox className="pb-2 pl-4 pr-4" onChange={shippingChangeHandler} value="No" checked={shipping=== "No"}>No</Checkbox>
        </>
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/filter</h4>
                    <hr />
                    <Menu defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} mode="inline">
                        {/* Price */}
                        <SubMenu key="1" title={<span classNamde="h6"><DollarOutlined />Price</span>}>
                            <div className="">
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v) => `$${v}`}
                                    range
                                    value={price}
                                    onChange={sliderHandler}
                                    max="4999"
                                />
                            </div>
                        </SubMenu>
                        {/* Category */}
                        <SubMenu key="2" title={<span classNamde="h6"><DownSquareOutlined />Categories</span>}>
                            <div style={{ marginTop: "-10px" }}>
                                {showCategories()}
                            </div>
                        </SubMenu>
                        {/* Stars */}
                        <SubMenu key="3" title={<span classNamde="h6"><StarOutlined />Rating</span>}>
                            <div style={{ marginTop: "-10px" }}>
                                {showStars()}
                            </div>
                        </SubMenu>
                        {/* Subcategories */}
                        <SubMenu key="4" title={<span classNamde="h6"><DownSquareOutlined />Subcategories</span>}>
                            <div style={{ marginTop: "-10px" }} className="px-4">
                                {showSubcategories()}
                            </div>
                        </SubMenu>
                        {/* Brands */}
                        <SubMenu key="5" title={<span classNamde="h6"><DownSquareOutlined />Brands</span>}>
                            <div style={{ marginTop: "-10px" }} className="pr-5">
                                {showBrands()}
                            </div>
                        </SubMenu>
                        {/* Colors */}
                        <SubMenu key="6" title={<span classNamde="h6"><DownSquareOutlined />Colors</span>}>
                            <div style={{ marginTop: "-10px" }} className="pr-5">
                                {showColors()}
                            </div>
                        </SubMenu>
                         {/* Shipping */}
                         <SubMenu key="7" title={<span classNamde="h6"><DownSquareOutlined />Shipping</span>}>
                            <div style={{ marginTop: "-10px" }} className="pr-5">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}
                    {products.length < 1 && <p>No Products Found</p>}

                    <div className="row pb-5">
                        {
                            products.map(p => {
                                return (
                                    <div key={p._id} className="col-md-4 mt-3">
                                        <ProductCard product={p} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop
