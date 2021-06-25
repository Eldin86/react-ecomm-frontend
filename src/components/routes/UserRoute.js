import React from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'

const UserRoute = ({ children, ...props }) => {
    const { user } = useSelector(state => ({ ...state }))

    return user && user.token ? (
        //If authenticated return route with rest of children content
        <Route {...props}></Route>
    ) : (
        <LoadingToRedirect />
    )
}

export default UserRoute