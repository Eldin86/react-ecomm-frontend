import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/nav/AdminNav'
import {getOrders, changeStatus} from '../../utils/admin'
import {useSelector, useDispatch} from 'react-redux'
import Orders from '../../components/order/Orders'
import {toast} from 'react-toastify'

const AdminDashboard = () => {

    const [orders, setOrders] = useState([])
    const {user} = useSelector(state => ({...state}))

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = () => {
        return getOrders(user.token)
            .then(res => {
                console.log(JSON.stringify(res.data, null, 4))
                setOrders(res.data)
            })
    }

    const changeStatusHandler = (orderId, orderStatus) => {
        changeStatus(orderId, orderStatus, user.token) 
            .then(res => {
                toast.success('Status updated')
                loadOrders()
            })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <h4>Admin Dashboard</h4>
                    <Orders orders={orders} changeStatusHandler={changeStatusHandler}/>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard