import React from 'react'
import { useFormik } from 'formik';
import validate from '../forms/validation/loginValidation'
import { useLogin } from '../hooks/useLogin';

const LoginForm = () => {
    const {login, error} = useLogin()
    const {values, errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
        initialValues:{ userName: '', password: '' },
        validate,
        onSubmit: async (values) => {
          await login(values.userName, values.password)
        },
    });

    return (
        <div className='form-wrapper login-form-wrapper'>
            <h2 className='form-heading'>Login</h2>
            <p className='form-sub-heading'>Please enter your login information.</p>
            <form onSubmit={handleSubmit} className='form1'>
                <div className="form-line">
                    <div className="input-wrapper">
                        <label htmlFor="userName">Username :</label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            className='input1'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.userName}
                        />
                        {(errors.userName && touched.userName ) ? <div className='input-error'> * {errors.userName}</div> : null}
                    </div>
                </div>
                <div className="form-line">
                    <div className="input-wrapper">
                        <label htmlFor="password">Password :</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className='input1'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        {errors.password ? <div className='input-error'> {errors.password}</div> : null} 
                    </div>
                </div>
                <div className="form-line">
                    <div className="submit-wrapper">
                        <button type="submit">login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginForm