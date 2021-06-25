import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import AdminNav from '../../../components/nav/AdminNav'
import DatePicker from 'react-datepicker'
import { getCoupons, removeCoupon, createCoupon } from '../../../utils/coupon'
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from '@ant-design/icons'

const CreateCoupon = () => {
    const [name, setName] = useState('')
    const [expiry, setExpiry] = useState('')
    const [discount, setDiscount] = useState('')
    const [loading, setLoading] = useState(false)
    const [coupons, setCoupons] = useState([])

    const {user} = useSelector(state => ({...state}))

    useEffect(() => {
        getCoupons()
            .then(res => {
                setCoupons(res.data)
            })
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        //console.table(name, expiry, discount)
        createCoupon({name, expiry, discount}, user.token)
            .then(res => {
                //update coupons after creation
                getCoupons().then(res => {setCoupons(res.data)})
                setLoading(false)
                setName("")
                setDiscount("")
                setExpiry("")
                toast.success(`"${res.data.name}" is created`)
            })
            .catch(e => console.log("create coupon error"), e)
    }

    const removeHandler = (couponId) => {
        console.log('couponId', couponId)
        if(window.confirm("Delete")){
            setLoading(true)
            removeCoupon(couponId, user.token)
                .then(res => {
                    //Update coupons after delete
                    getCoupons().then(res => {setCoupons(res.data)})
                    setLoading(false)
                    toast.error(`Coupon "${res.data.name}" is deleted`)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Coupon</h4>}
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name}
                                onChange={e => setName(e.target.value)} 
                                autoFocus
                                required/>
                        </div>

                        <div className="form-group">
                            <label className="text-muted">Discount %</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={discount}
                                onChange={e => setDiscount(e.target.value)} 
                                required/>
                        </div>

                        <div className="form-group">
                            <label className="text-muted">Expiry</label>
                            <br/>
                            <DatePicker 
                                className="form-control" 
                                selected={new Date()} 
                                value={expiry}
                                //Components expects date and pass date into setExpiry
                                onChange={date => setExpiry(date)}/>
                        </div>

                        <button className="btn btn-outlined-primary">Save</button>
                    </form>
                    <br/>
                    <h4>{coupons.length} Coupons</h4>
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiry</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(c => {
                                return (
                                    <tr key={c._id}>
                                        <td>{c.name}</td>
                                        <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                        <td>{c.discount}</td>
                                        <td><DeleteOutlined onClick={() => removeHandler(c._id)} className="text-danger" style={{cursor: "pointer"}}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CreateCoupon
