import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubcategories } from '../../utils/subcategory'

const SubList = () => {
    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getSubcategories()
            .then(res => {
                setSubcategories(res.data)
                setLoading(false)
            })

    }, [])

    const showSubcategories = () => subcategories.map(s => (
        <div key={s._id} className="col btn btn-outlined-primary btn-large btn-block btn-raised m-3">
            <Link to={`/subcategory/${s.slug}`}>
                {s.name}
            </Link>
        </div>
        ))

    return (
        <div className="container">
            <div className="row">
                {loading ? (<h4 className="text-center">Loading...</h4>) : showSubcategories()}
            </div>
        </div>
    )
}


export default SubList
