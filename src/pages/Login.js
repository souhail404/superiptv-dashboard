import React from 'react'

import LoginForm from '../components/LoginForm';

const Login = () => {

    return (
        <div className='login-page'>
            <div className="image-side">
                <img src="/images/blue-bg.jpg" alt="technologie background" />
            </div>
            <div className="form-side">
                <LoginForm />
            </div>
        </div>
    )
}

export default Login
