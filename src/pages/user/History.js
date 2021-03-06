import React, { useState, useEffect } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getUserOrders } from '../../utils/user'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo'
import Invoice from '../../components/order/Invoice'
import {
    PDFDownloadLink,
} from '@react-pdf/renderer'

const History = () => {
    const [orders, setOrders] = useState([])

    const { user } = useSelector(state => ({ ...state }))

    useEffect(() => {
        loadUserOrders()
    }, [])

    const loadUserOrders = () => getUserOrders(user.token).then(res => {
        console.log('res.data orders', res.data)
        setOrders(res.data)
    })

    const showOrderInTable = (order) => {
        return (
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Price</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Color</th>
                        <th scope="col">Count</th>
                        <th scope="col">Shipping</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products.map((p, i) => {
                        return (
                            <tr key={i}>
                                <td><strong>{p.product.title}</strong></td>
                                <td>{p.product.price}</td>
                                <td>{p.product.brand}</td>
                                <td>{p.color}</td>
                                <td>{p.count}</td>
                                <td>{p.product.shipping === "Yes" ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    const showDownloadLink = (order) => {
        return (
            <PDFDownloadLink document={
                <Invoice order={order}/>
            }
            className="btn btn-small btn-block btn-outlined-primary"
            //Name of pdf when user download it
            fileName="invoice.pdf">
                Download PDF
            </PDFDownloadLink>
        )
    }

    const showEachOrders = () => {
        return orders.reverse().map((o, i) => {
            return (<div key={i} className="m-5 p-3 card">
                <ShowPaymentInfo order={o} />
                {showOrderInTable(o)}
                <div>
                    {showDownloadLink(o)}
                </div>
            </div>)
        }
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col text-center">
                    <h4>{orders.length > 0 ? "User purchase orders" : "No purchase orders"}</h4>
                    {showEachOrders()}
                </div>
            </div>
        </div>
    )
}

export default History
