import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { createCategory, getCategories, removeCategory } from '../../../utils/category'
import { toast } from 'react-toastify'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import AdminNav from '../../../components/nav/AdminNav'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

const CategoryCreate = () => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => ({ ...state }))
    const [categories, setCategories] = useState([])
    //Implement seaarching filter in 5 steps
    //Search while typing
    //Step 1 Searching/filtering 
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = () => getCategories().then(c => setCategories(c.data))

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        //Posaljemo kao objekat name
        createCategory({ name }, user.token)
            .then(res => {
                setLoading(false)
                setName('')
                console.log('res', res)
                toast.success(`"${res.data.name}" is created`)
                //Update UI after category is created
                //Send request again and render categories after categorie is created
                loadCategories()
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
            removeCategory(slug, user.token)
                .then(res => {
                    setLoading(false)
                    toast.error(`${res.data.name} deleted`)
                    //Update UI after category is created
                    //Send request again and render categories after categorie is deleted
                    loadCategories()
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
            return  c.name.toLowerCase().includes(keyword)
        }
    }

    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Create category</h4>}
                    <CategoryForm submitHandler={submitHandler} name={name} setName={setName}/>
                    {/* Step 2 type search query and step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
                    
                    {/* Step 5 */}
                    {
                        categories.filter(searched(keyword)).map(c => {
                            return (
                                <div className="alert alert-secondary" key={c._id}>
                                    {c.name}
                                    <span onClick={() => removeHandler(c.slug)} className="btn btn-sm float-right"><DeleteOutlined className="text-danger" /></span>
                                    <span className="btn btn-sm float-right"><Link to={`/admin/category/${c.slug}`}><EditOutlined className="text-warning" /></Link></span>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default CategoryCreate