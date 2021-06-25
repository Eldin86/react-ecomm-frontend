import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

const Search = () => {
    const dispatch = useDispatch()
    const { search } = useSelector(state => ({ ...state }))
    const { text } = search

    const history = useHistory()


    const changeHandler = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: e.target.value }
        })
    }
    //when user press enter in search we want him to take to search page
    const submitHandler = (e) => {
        e.preventDefault()
        history.push(`/shop?${text}`)
    }

    return (
        <form className="form-inline my-2 my-lg-0" onSubmit={submitHandler}>
            {/* text is from reducer */}
            <input onChange={changeHandler} type="search" value={text} className="form-control mr-sm-2" placeholder="Search" />
            <SearchOutlined onClick={submitHandler} style={{ cursor: 'pointer' }} />
        </form>
    )
}

export default Search
