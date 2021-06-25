import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { updateSubcategory, getSubcategory } from '../../../utils/subcategory'
import { getCategories } from '../../../utils/category'
import { toast } from 'react-toastify'

import AdminNav from '../../../components/nav/AdminNav'
import CategoryForm from '../../../components/forms/CategoryForm'

const SubcategoryUpdate = ({ match, history }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(state => ({ ...state }))
  //List of categories
  const [categories, setCategories] = useState([])
  const [parent, setParent] = useState('')

  useEffect(() => {
    loadCategories()
    loadSubcategory()
    // eslint-disable-next-line
  }, [])

  const loadCategories = () => getCategories().then(c => setCategories(c.data))

  const loadSubcategory = () => getSubcategory(match.params.slug).then(s => {
    setName(s.data.name)
    setParent(s.data.parent)
  })

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    //Posaljemo kao objekat name
    updateSubcategory(match.params.slug, { name, parent }, user.token)
      .then(res => {
        setLoading(false)
        setName('')
        toast.success(`"${res.data.name}" is updated`)
        history.push('/admin/subcategory')
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
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update sub category</h4>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => {
                  console.log("c._id", c._id)
                  console.log("parent", parent)
                  return (
                    <option key={c._id} value={c._id} selected={c._id === parent}>
                      {c.name}
                    </option>
                  )
                })}
            </select>
          </div>

          <CategoryForm
            submitHandler={submitHandler}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  )
}

export default SubcategoryUpdate