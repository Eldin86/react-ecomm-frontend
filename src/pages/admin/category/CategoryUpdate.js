import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { updateCategory, getCategory } from '../../../utils/category'
import { toast } from 'react-toastify'

import AdminNav from '../../../components/nav/AdminNav'
import CategoryForm from '../../../components/forms/CategoryForm'

//da params dohvatimo mozemo koristiti match unutar props ili useParams()
const CategoryUpdate = ({ history, match }) => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => ({ ...state }))

    useEffect(() => {
        loadCategory()
        // eslint-disable-next-line
    }, [])

    const loadCategory = () => getCategory(match.params.slug).then(c => setName(c.data.name))

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        //Posaljemo kao objekat name
        updateCategory(match.params.slug, { name }, user.token)
            .then(res => {
                setLoading(false)
                setName('')
                toast.success(`"${res.data.name}" is updated`)
                history.push('/admin/category')
            })
            .catch(e => {
                setLoading(false)
                if (e.response.status === 400) toast.error(e.response.data)
            })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update category</h4>}
                    <CategoryForm submitHandler={submitHandler} name={name} setName={setName}/>
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default CategoryUpdate