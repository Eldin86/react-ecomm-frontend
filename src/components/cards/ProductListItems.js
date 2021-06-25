import React from 'react'
import { Link } from 'react-router-dom'

const ProductListItems = ({ product }) => {
    const {
        price,
        category,
        subcategories,
        shipping,
        color,
        brand,
        quantity,
        sold } = product
    return (
        <ul className="list-group">
            <li className="list-group-item">
                Price {" "}
                <span className="label label-default label-pill pull-xs-right">${price}</span>
            </li>
            {
                category && <li className="list-group-item">
                    Category {" "} <Link to={`/category/${category.slug}`} className="label label-default label-pill pull-xs-right">
                        {category.name}
                    </Link>
                </li>
            }
            {
                subcategories && (
                    <li className="list-group-item">
                        Subcategories
                        {
                            subcategories.map(s => {
                                //automatski imamo i u single product opciju da vidimo sve kategorije produkta koje su dostupne tako sto smo postavili route /category/${category.slug}
                                return (
                                    <Link key={s._id} to={`/subcategories/${s.slug}`} className="label label-default label-pill pull-xs-right">{s.name}</Link>
                                )
                            })
                        }
                    </li>
                )
            }
            <li className="list-group-item">
                Shipping {" "}
                <span className="label label-default label-pill pull-xs-right">{shipping}</span>
            </li>
            <li className="list-group-item">
                Color {" "}
                <span className="label label-default label-pill pull-xs-right">{color}</span>
            </li>
            <li className="list-group-item">
                Brand {" "}
                <span className="label label-default label-pill pull-xs-right">{brand}</span>
            </li>
            <li className="list-group-item">
                Available {" "}
                <span className="label label-default label-pill pull-xs-right">{quantity}</span>
            </li>
            <li className="list-group-item">
                Sold {" "}
                <span className="label label-default label-pill pull-xs-right">{sold}</span>
            </li>
        </ul>
    )
}

export default ProductListItems
