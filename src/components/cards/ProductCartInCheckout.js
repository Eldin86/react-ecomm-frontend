import React from 'react'
import ModalImage from "react-modal-image";
import laptop from '../../images/laptop.png'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'

const ProductCartInCheckout = ({ p }) => {

    const colors = ["Black", "Brown", "Silver", "White", "Blue"]
    const dispatch = useDispatch()

    const colorChangeHandler = (e) => {
        console.log(e.target.value)
        //update cart after color is updated
        let cart = []
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                //Store cart from localStorage into cart variable
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.map((product, index) => {
                //If product is identical
                if (product._id === p._id) {
                    //Update color
                    cart[index].color = e.target.value
                }
            })
            //Store updated cart into localStorage
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: "ADD_TO_CART",
                payload: cart
            })
        }
    }

    const quantityHandler = (e) => {
        //if value is less then 1 set is always 1 else set another value
        let count = e.target.value < 1 ? 1 : e.target.value

        //if count is greater than quantity we have
        if (count > p.quantity) {
            toast.error(`Max available quantity: ${p.quantity}`)
            return
        }

        let cart = []
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.map((product, i) => {
                //p._id product from props
                if (product._id === p._id) {
                    cart[i].count = count
                }
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: "ADD_TO_CART",
                payload: cart
            })
        }
    }

    const removeHandler = () => {
   
          let cart = []
          if (typeof window !== 'undefined') {
              if (localStorage.getItem('cart')) {
                  cart = JSON.parse(localStorage.getItem('cart'))
              }
              cart.map((product, i) => {
                  //p._id product from props
                  if (product._id === p._id) {
                      cart.splice(i, 1)
                  }
              })
              localStorage.setItem('cart', JSON.stringify(cart))
              dispatch({
                  type: "ADD_TO_CART",
                  payload: cart
              })
          }
    }

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: '100px', height: 'auto' }}>
                        {p.images.length ? (
                            <ModalImage
                                small={p.images[0].url}
                                large={p.images[0].url}
                                alt={p.title}
                            />
                        ) : (
                            <ModalImage
                                small={laptop}
                                large={laptop}
                                alt={p.title}
                            />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select onChange={e => colorChangeHandler(e)} name="color" className="form-control">
                        {
                            p.color ? <option value={p.color}>{p.color}</option> : <option>Select</option>
                        }
                        {
                            //p is color we pass as props, show all colors except p.color so colors are not duplicated in dropdown
                            colors.filter(c => c !== p.color).map(c => <option key={c} value={c}>{c}</option>)
                        }
                    </select>
                </td>
                <td className="text-center">
                    <input type="number" className="form-control" value={p.count} onChange={quantityHandler} />
                </td>
                <td className="text-center">
                    {
                        p.shipping === "Yes" 
                            ? <CheckCircleOutlined className="text-success"/> 
                            : <CloseCircleOutlined className="text-danger"/> 
                    }
                </td>
                <td className="text-center">
                    <CloseOutlined onClick={removeHandler} className="text-danger pointer"/>
                </td>
            </tr>
        </tbody>
    )
}

export default ProductCartInCheckout
