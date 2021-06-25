import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { StarOutlined } from '@ant-design/icons'
import { useHistory, useParams } from 'react-router-dom'

const RatingModal = ({ children }) => {
    const { user } = useSelector(state => ({ ...state }))
    const [modalVisible, setModalVisible] = useState(false)

    const history = useHistory()
    const {slug} = useParams()

    const modalHandler = () => {
        if (user && user.token) {
            setModalVisible(true)
        } else {
            //We also are doing check in Login page
            history.push({
                //Redirect user to login page
                pathname: '/login',
                //react router dom state, so we can set url to state
                //in state we set url
                state: { from: `/product/${slug}` }
            })
        }
    }

    return (
        <>
            <div onClick={modalHandler}>
                <StarOutlined className="text-danger" /> <br /> {" "}
                {user ? "Leave Rating" : "Login to leave rating"}
            </div>
            <Modal
                title="Leave your rating"
                centered
                visible={modalVisible}
                onOk={() => { setModalVisible(false); toast.success('Thanks for your review. It will apper soon') }}
                onCancel={() => setModalVisible(false)}>
                {children}
            </Modal>
        </>
    )
}

export default RatingModal
