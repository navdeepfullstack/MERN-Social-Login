import { useState, useEffect } from 'react';
import './style.css';
import { useGoogleLogin } from '@react-oauth/google';
import { selectComponent, socialLogin, toggleModal } from '../../redux/actions/dealerActions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";


const SocialLogin = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [googleUser, setGoogleUser] = useState();
    const [loginError, setLoginError] = useState("")


    const handleSocialLogin = async (googleUser = null, fbUser = null) => {
        // e.preventDefault();
        try {
            let socialLoginBody = {}
            if (googleUser) {
                socialLoginBody = {
                    name: googleUser.name,
                    login: googleUser.email,
                    email: googleUser.email,
                    picture: googleUser.picture,
                    role: "user",
                    google_id: googleUser.id,
                    loginMethod: 2
                }
            }
            else if (fbUser) {
                socialLoginBody = {
                    name: fbUser.name,
                    ...(fbUser.email ? { login: fbUser.email } : {}),
                    ...(fbUser.email ? { email: fbUser.email } : {}),
                    picture: fbUser.picture.data.url,
                    role: "user",
                    fb_id: fbUser.id,
                    loginMethod: 3
                }
            }

            const socialLoginResp = await dispatch(
                socialLogin(socialLoginBody)
            );

            if (socialLoginResp.status === "success") {
                toast.success("Sign In Successful")
                history.push(`/profile/${socialLoginResp.id}`);
                dispatch(toggleModal(false))
                // document.body.classList.remove('overflow_hidden');

            } else {
                toast.error("Sign In Failure")
                setLoginError(socialLoginResp.error)
                setTimeout(() => {
                    setLoginError("")
                }, 7000)
            }

        } catch (err) {
            console.log(err);
        }
    };


    useEffect(
        () => {
            if (googleUser) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${googleUser.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        handleSocialLogin(res.data, null)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [googleUser]
    );

    const googleLoginFunc = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setGoogleUser(codeResponse)
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const handleClick = (method) => {
        dispatch(selectComponent(method))
    }

    const responseFacebook = (response) => {
        if (response.status === "unknown") {
            toast.error("Login failed!")
            return false;
        }
        if (response.accessToken) {
            handleSocialLogin(null, response)
        } else {
            toast.error("Login failed!")

            return false;
        }
    };


    return (
        <>
            <h1>Sign In</h1>
            <p className='my-3 py-2'>Are you a new customer? <button className='comp_button' onClick={() => {
                dispatch(selectComponent("create_account"))
            }} >Create an account here</button></p>

            {
                loginError != '' &&
                (
                    <div className='error_msg1 mt-2'>
                        <h6>There's been an error signing you in</h6>
                        <p>{loginError}</p>
                    </div>
                )
            }


            <div className='socila_login_btn mt-4 px-3'>

                <button className='btn social_btn1' onClick={() => {
                    handleClick("google_login")
                    googleLoginFunc()
                }}>
                    <img src={require('../../../src/images/google.png')} alt="google" />
                    Continue with Google
                </button>

                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="public_profile,email,user_friends"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    render={renderProps => (
                        <button className='btn social_btn1' onClick={() => {
                            handleClick("fb_login")
                            renderProps.onClick()
                        }}>
                            <img src={require('../../../src/images/facebook.png')} alt="google" />
                            Continue with Facebook
                        </button>
                    )}
                />


                <button className='btn social_btn1' onClick={() => handleClick("signin")}>
                    <img src={require('../../../src/images/email.png')} alt="google" />
                    Continue with Email
                </button>

                <p className='my-3 py-2'>By Continuing, you agree to our <button className='comp_button'>Terms of Use</button> and <button className='comp_button' >Privacy Policy</button></p>
            </div>
        </>
    )
}

export default SocialLogin;