import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from '../../utils/auth'



const Login = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    let dispatch = useDispatch();

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        let intended = history.location.state
        //If user wants to leave rating and if not logged in?
        if (intended) {
            console.log('useEffect intended', intended)
            return
        } else {
            //If we are already logged in means we have user, then redirect us to homepage, prevent user to type /login in url
            if (user && user.token) history.push("/");
        }
        // eslint-disable-next-line
    }, [user]);

    const roleBasedRedirect = (res) => {
        //check if intended page
        //provjerimo da li imamo location.state tako da mozemo da redirect usera na prethodnu stranicu
        let intended = history.location.state
        //If we have state object we sent from RatingModal page
        if (intended) {
            history.push(intended.from)
        } else {
            if (res.data.role === 'admin') {
                history.push('/admin/dashboard')
            } else {
                history.push('/user/history')
            }
        }
    }

    //Login with email
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.table(email, password);
        try {
            //Return result with email
            const result = await auth.signInWithEmailAndPassword(email, password);
            //console.log('Login result', result);
            const { user } = result;
            //Get token from logged in user
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
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
                    roleBasedRedirect(res)
                })
                .catch(e => console.log(e))

            //history.push("/");

        } catch (error) {
            //console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    //Login with google account
    const googleLogin = async () => {
        auth
            .signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                //console.log('Google result', result)
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
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
                        roleBasedRedirect(res)
                    })
                    .catch(e => console.log(e))
                // history.push("/");
            })
            .catch((err) => {
                //console.log(err);
                toast.error(err.message);
            });
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    autoFocus
                />
            </div>

            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                />
            </div>

            <br />
            <Button
                onClick={handleSubmit}
                type="primary"
                className="mb-3"
                block
                shape="round"
                icon={<MailOutlined />}
                size="large"
                disabled={!email || password.length < 6}
            >
                Login with Email/Password
      </Button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Login</h4>
                    )}
                    {loginForm()}

                    <Button
                        onClick={googleLogin}
                        type="danger"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<GoogleOutlined />}
                        size="large"
                    >
                        Login with Google
          </Button>

                    <Link to="/forgot/password" className="float-right text-danger">
                        Forgot Password
          </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
