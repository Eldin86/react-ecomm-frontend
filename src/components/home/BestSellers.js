import React, { useEffect, useState } from 'react'
import { getProducts, getProductsCount } from '../../utils/product'

import ProductCard from '../cards/ProductCard'
import LoadingCard from '../cards/LoadingCard'
import { Pagination } from 'antd'

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  //Default number of products
  const [productsCount, setProductsCount] = useState(0)
  //Default page for pagination 1
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadAllProducts()
  }, [page])

  useEffect(() => {
    //Count all products
    getProductsCount().then(res => { setProductsCount(res.data) })
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    //sort, order,limit
    //Sort by best sellers product
    getProducts('sold', 'desc', page)
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch()
  }

  return (
    <>
      <div className="container">
        {/* Show loading skeleton until we get products */}
        {loading ? <LoadingCard count={3} /> : <div className="row">
          {products.map(product => {
            return (
              <div key={product._id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-4 p-3">
          <Pagination current={page} total={(productsCount / 3) * 10} onChange={value => setPage(value)} />
        </nav>
      </div>
    </>
  );
}

export default BestSellers;
