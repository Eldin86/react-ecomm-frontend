import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { createSubcategory, getSubcategories, removeSubcategory } from '../../../utils/subcategory'
import { getCategories } from '../../../utils/category'
import { toast } from 'react-toastify'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import AdminNav from '../../../components/nav/AdminNav'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

const SubcategoryCreate = () => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => ({ ...state }))
    //List of categories
    const [categories, setCategories] = useState([])
    //Category user clicked from dropdown menu in submenu page
    //Saljemo u backend da bismo kreirali novu subkategoriju
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState([])
    //Implement seaarching filter in 5 steps
    //Search while typing
    //Step 1 Searching/filtering 
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        loadCategories()
        loadSubcategories()
    }, [])

    const loadCategories = () => getCategories().then(res => {
        setCategories(res.data)
    })

    const loadSubcategories = () => getSubcategories().then(s => setSubcategory(s.data))

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        //Posaljemo kao objekat name
        createSubcategory({ name, parent: category }, user.token)
            .then(res => {
                setLoading(false)
                setName('')
                toast.success(`"${res.data.name}" is created`)
                //When we create new subcategory get data to update UI
                loadSubcategories()
            })
            .catch(e => {
                setLoading(false)
                if (e.response.status === 400) toast.error(e.response.data)
            })
    }

    const removeHandler = async (slug) => {
        let answer = window.confirm("Delete?")
        if (answer) {
            setLoading(true)
            removeSubcategory(slug, user.token)
                .then(res => {
                    setLoading(false)
                    toast.error(`${res.data.name} deleted`)
                    //When we delete subcategory get data to update UI
                    loadSubcategories()
                })
                .catch(e => {
                    setLoading(false)
                    if (e.response.status === 400) {
                        setLoading(false)
                        toast.error(e.response.data)
                    }
                })
        }
    }

    //step 4
    const searched = (keyword) => {
        return (c) => {
            //Return only value that includes keyword inside objects
            return c.name.toLowerCase().includes(keyword)
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Create subcategory</h4>}

                    <div className="form-group">
                        <label>Parent Category</label>
                        <select name="category" className="form-control" onChange={e => setCategory(e.target.value)}>
                            {/* Placeholder */}
                            <option>Please Select</option>
                            {
                                categories.length > 0 && categories.map((c) => {
                                    return <option key={c._id} value={c._id}>{c.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <CategoryForm submitHandler={submitHandler} name={name} setName={setName} />

                    {/* Step 2 type search query and step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />

                    {/* Step 5 */}
                    {
                        subcategory.filter(searched(keyword)).map(s => {
                            return (
                                <div className="alert alert-secondary" key={s._id}>
                                    {s.name}
                                    <span onClick={() => removeHandler(s.slug)} className="btn btn-sm float-right"><DeleteOutlined className="text-danger" /></span>
                                    <span className="btn btn-sm float-right"><Link to={`/admin/subcategory/${s.slug}`}><EditOutlined className="text-warning" /></Link></span>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default SubcategoryCreate