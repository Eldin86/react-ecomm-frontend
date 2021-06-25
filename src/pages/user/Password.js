import React, { useState } from 'react'
import UserNav from '../../components/nav/UserNav'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'

const Password = () => {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

const submitHandler = async (e) => {
   e.preventDefault()
   setLoading(true)
   await auth.currentUser.updatePassword(password)
    .then(() => {
        setLoading(false)
        setPassword('')
        toast.success('Password updated')
    })
    .catch(e => {
        setLoading(false)
        toast.error(e.message)
    })
}

    const passwordUpdateForm = () => {
        return (
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Your Password</label>
                    <input 
                        type="password" 
                        onChange={e => setPassword(e.target.value)} 
                        className="form-control" 
                        value={password}
                        placeholder="enter new password" 
                        disabled={loading}/>
                    <button className="btn btn-primary" disabled={!password || password.length < 6 || loading}>Submit</button>
                </div>
            </form>
        )
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Password Update</h4>}
                    {passwordUpdateForm()}
                </div>
            </div>
        </div>
    )
}

export default Password
