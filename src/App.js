import React, { useEffect, lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
//React-Toastify allows you to add notifications to your app with ease.
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {LoadingOutlined} from '@ant-design/icons'


import { currentUser } from './utils/auth'
import { auth } from './firebase'
import { useDispatch } from 'react-redux'

// import Login from './pages/auth/Login'
// import Register from './pages/auth/Register'
// import Home from './pages/Home'
// import Header from './components/nav/Header'
// import RegisterComplete from './pages/auth/RegisterComplete'
// import ForgotPassword from './pages/auth/ForgotPassword'
// import History from './pages/user/History'
// import Password from './pages/user/Password'
// import Wishlist from './pages/user/Wishlist'
// import UserRoute from './components/routes/UserRoute'
// import AdminRoute from './components/routes/AdminRoute'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import CategoryCreate from './pages/admin/category/CategoryCreate'
// import CategoryUpdate from './pages/admin/category/CategoryUpdate'
// import SubcategoryCreate from './pages/admin/subcategory/SubcategoryCreate'
// import SubcategoryUpdate from './pages/admin/subcategory/SubcategoryUpdate'
// import ProductCreate from './pages/admin/product/ProductCreate'
// import ProductUpdate from './pages/admin/product/ProductUpdate'
// import AllProducts from './pages/admin/product/AllProducts'
// import Product from './pages/Product'
// import CategoryHome from './pages/category/CategoryHome'
// import SubHome from './pages/sub/SubHome'
// import Shop from './pages/Shop'
// import Checkout from './pages/Checkout'
// import Payment from './pages/Payment'
// import Cart from './pages/Cart'
// import SideDrawer from './components/drawer/SideDrawer'
// import CreateCoupon from './pages/admin/coupon/CreateCoupon'

//Using lazy loading

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Home = lazy(() => import('./pages/Home'))
const Header = lazy(() => import('./components/nav/Header'))
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const History = lazy(() => import('./pages/user/History'))
const Password = lazy(() => import('./pages/user/Password'))
const Wishlist = lazy(() => import('./pages/user/Wishlist'))
const UserRoute = lazy(() => import('./components/routes/UserRoute'))
const AdminRoute = lazy(() => import('./components/routes/AdminRoute'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const CategoryCreate = lazy(() => import('./pages/admin/category/CategoryCreate'))
const CategoryUpdate = lazy(() => import('./pages/admin/category/CategoryUpdate'))
const SubcategoryCreate = lazy(() => import('./pages/admin/subcategory/SubcategoryCreate'))
const SubcategoryUpdate = lazy(() => import('./pages/admin/subcategory/SubcategoryUpdate'))
const ProductCreate = lazy(() => import('./pages/admin/product/ProductCreate'))
const ProductUpdate = lazy(() => import('./pages/admin/product/ProductUpdate'))
const AllProducts = lazy(() => import('./pages/admin/product/AllProducts'))
const Product = lazy(() => import('./pages/Product'))
const CategoryHome = lazy(() => import('./pages/category/CategoryHome'))
const SubHome = lazy(() => import('./pages/sub/SubHome'))
const Shop = lazy(() => import('./pages/Shop'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Payment = lazy(() => import('./pages/Payment'))
const Cart = lazy(() => import('./pages/Cart'))
const SideDrawer = lazy(() => import('./components/drawer/SideDrawer'))
const CreateCoupon = lazy(() => import('./pages/admin/coupon/CreateCoupon'))

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    //Access currently logged in user from firebase
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      //Check if we have user, then dispatch email and token
      if (user) {
        //Use token to access protected routes from backend
        const idTokenResult = await user.getIdTokenResult();
        //Return current user data info
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id
              },
            });
          })
          .catch(e => console.log(e))

      }
    })
    //Cleanup
    return () => unsubscribe();
  }, [dispatch])

  return (
    <Suspense fallback={
      <div className="col text-center p-5">
        eShop EC<LoadingOutlined />MERCE __
      </div>
    }>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        {/* We "created" custom route, that way we checked if user is logged in, (we protect route) */}
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/payment" component={Payment} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate} />
        <AdminRoute exact path="/admin/subcategory/:slug" component={SubcategoryUpdate} />
        <AdminRoute exact path="/admin/subcategory" component={SubcategoryCreate} />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/subcategory/:slug" component={SubHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/admin/coupon" component={CreateCoupon} />
      </Switch>
    </Suspense>
  );
}

export default App;
