import React, {useState, useEffect} from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
import { currentAdmin } from '../../utils/auth'

const AdminRoute = ({ children, ...props }) => {
    const { user } = useSelector(state => ({ ...state }))
    const [ok, setOk] = useState(false)

    useEffect(() => {
        //Check if we have user
        if(user && user.token){
            currentAdmin(user.token)
                .then(res => {
                    //console.log('Current admin res', res)
                    setOk(true)
                })
                .catch(e => {
                    //console.log('ADMIN route err', e)
                    setOk(false)
                })
        }
        //Whenever user in state changes we want to run this function
    }, [user])

    return ok ? (
        //If authenticated return route with rest of children content
        <Route {...props}></Route>
    ) : (
        <LoadingToRedirect />
    )
}

export default AdminRoute