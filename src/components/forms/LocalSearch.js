import React from 'react'

const LocalSearch = ({keyword, setKeyword}) => {
        //Step 3 create handler 
        const searchHandler = (e) => {
            e.preventDefault()
            setKeyword(e.target.value.toLowerCase())
        }
    return (
            <input
                type="search"
                placeholder="filter"
                value={keyword}
                onChange={searchHandler}
                className="form-control mb-4" />
    )
}

export default LocalSearch
