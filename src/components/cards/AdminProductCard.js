import React from 'react'
import { Card } from 'antd'
import Laptop from '../../images/laptop.png'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Meta } = Card


const AdminProductCard = ({ product, removeHandler }) => {
    const { title, description, images, slug } = product

    return (
        <Card cover={
            <img src={images && images.length ? images[0].url : Laptop} style={{ height: "140px", objectFit: "cover" }} alt={title} className="p-1" />
        }
            actions={
                [
                    <Link to={`/admin/product/${slug}`}>
                        <EditOutlined className="text-warning" />
                    </Link>,
                    <DeleteOutlined onClick={() => removeHandler(slug)}
                        className="text-danger" />]
            }>
            <Meta title={title} description={`${description && description.substring(0, 40)}...`} />
        </Card>
    )
}

export default AdminProductCard
