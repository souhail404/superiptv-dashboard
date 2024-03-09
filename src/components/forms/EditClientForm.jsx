import React, { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@mui/material';


const NameField = ({ state, setState , setError, error}) => {
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Client Name is Required');
            } else if (state.length < 2 || state.length > 50) {
                setError('Client Name must be between 2 and 50 characters');
            } else {
                setError('');
            }
        }, 300),
        [state]
    );

    useEffect(() => {
        if (touched){
           validate(); 
        } 
    }, [touched, validate]);

    return (
        <div className="input-wrapper">
            <label htmlFor="client-name">Name :</label>
            <input
                type="text"
                className='input1'
                name='client-name'
                id='client-name'
                required
                value={state}
                onChange={(e) => { setState(e.target.value) }}
                onBlur={() => setTouched(true)} />

            {(error && touched) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const UserNameField = ({ state, setState, setError, error }) => {
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
        debounce(() => {
            const regex = /^[a-zA-Z0-9_]+$/;
            if (!state) {
                setError('Username is Required');
            } else if (state.length < 4 || state.length > 20) {
                setError('Username must be between 4 and 20 characters');
            } else if (!regex.test(state)) {
                setError('Username can only contain letters, numbers, and underscores');
            } else {
                setError('');
            }
        }, 300),
        [state]
    );


    useEffect(() => {
        if (touched) validate();
    }, [touched, validate]);

    return (
        <div className="input-wrapper">
            <label htmlFor="client-username">Username :</label>
            <input
                type="text"
                className='input1'
                name='client-username'
                id='client-username'
                required
                value={state}
                onChange={(e) => { setState(e.target.value)}}
                onBlur={() => setTouched(true)} />

            {(error && touched) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const PasswordField = ({ state, setState, setError, error }) => {
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('');
            } else if (state.length < 8) {
                setError('Password must be at least 8 characters long');
            } else if (!/[A-Z]/.test(state)) {
                setError('Password must contain at least one uppercase letter');
            } else if (!/[a-z]/.test(state)) {
                setError('Password must contain at least one lowercase letter');
            } else if (!/\d/.test(state)) {
                setError('Password must contain at least one digit');
            } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(state)) {
                setError('Password must contain at least one special character');
            } else {
                setError('');
            }
        }, 300),
        [state]
    );

    useEffect(() => {
        if (touched){
           validate(); 
        } 
    }, [touched,validate]);

    return (
        <div className="input-wrapper">
            <label htmlFor="client-password">Password :</label>
            <input
                type="password"
                className='input1'
                name='client-password'
                id='client-password'
                value={state}
                onChange={(e) => { setState(e.target.value) }}
                onBlur={() => setTouched(true)} />

            {(error && touched) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const ConfirmPasswordField = ({ state, setState, password, setError, error }) => {
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
        debounce(() => {
            if (!state && password) {
                setError('Password Confirmation is Required');
            } else if (state !== password) {
                setError('Password does not match');
            } else {
                setError('');
            }
        }, 300),
        [state, password]
    );

    useEffect(() => {
        if (touched) validate();
    }, [touched, validate]);

    return (
        <div className="input-wrapper">
            <label htmlFor="client-cfpassword">Confirm password :</label>
            <input
                type="password"
                className='input1'
                name='client-cfpassword'
                id='client-cfpassword'
                value={state}
                onChange={(e) => { setState(e.target.value)}}
                onBlur={() => setTouched(true)} />

            {(error && touched) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const IsActiveField = (props) => {
    const state = props.state;
    const setState = props.setState; 
    return(
        <div className="input-wrapper input-checkbox-wrapper">
            <label htmlFor="" className='no-margin'>Active :</label>
            <label htmlFor="client-isactive" className={`checkbox-label ${state ? 'on':'off'}`}>
                <div>
                    <span></span>
                </div>
            </label>
            <input  type="checkbox" 
                    className='input1 input-checkbox' 
                    name='client-isactive' 
                    id='client-isactive' 
                    min={0}
                    checked={state}
                    onChange={()=>{setState(!state)}} />
        </div>
    )
}

const IsLoyalField = (props) => {
    const state = props.state;
    const setState = props.setState;
    return(
        <div className="input-wrapper input-checkbox-wrapper">
            <label htmlFor="" className='no-margin'>Loyal :</label>
            <label htmlFor="client-isloyal" className={`checkbox-label ${state ? 'on':'off'}`}>
                <div>
                    <span></span>
                </div>
            </label>
            <input  type="checkbox" 
                    className='input1 input-checkbox' 
                    name='client-isloyal' 
                    id='client-isloyal' 
                    min={0}
                    checked={state}
                    onChange={()=>{setState(!state)}} />
        </div>
    )
}

const EditClientForm = ({clientId , type}) => {
    // const {clientId} = useParams()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    // data states
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [active, setActive] = useState(true);
    const [loayal, setLoyal] = useState(false);
    // error states
    const [nameError, setNameError] = useState(null);
    const [userNameError, setUserNameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [formError, setFormError] = useState(null);
    // general states
    const [IsSubmiting, setIsSubmiting] = useState(false);
    const [IsFetching, setIsFetching] = useState(false);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setIsSubmiting(true)

        if (formError===null ){
            const toastId = toast.loading("Updating User...");
            var data = {}
            if (password) {
                data = {name, userName, password, role:type, isActive:active, isLoyal:loayal}
            }
            else{
                data = {name, userName, role:type, isActive:active, isLoyal:loayal}
            }
            

            const response = await fetch(`/api/user/update/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: JSON.stringify(data)
            })

            const json = await response.json()

            if(response.ok){
                toast.update(toastId, {render: "User Updated Succesfully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${json.message}`, type: "error", isLoading: false, autoClose:4000});
            }
        }
    }

    const getUser = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/user/id/${clientId}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {user} = response;
              setName(user.name);
              setUserName(user.userName);
              setActive(user.isActive)
              setLoyal(user.isLoyal)
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            toast.error(`Internal server error`)
            setIsFetching(false)
        } 
    }

    useEffect(()=>{
        setFormError(null)
        
        if (nameError && nameError.length > 0) {
            setFormError('error, please check the "Name" field')
        }
        else if (userNameError && userNameError.length > 0) {
            setFormError('error, please check the "usename" field')
        }
        else if (passwordError && passwordError.length > 0) {
            setFormError('error, please check the "password" field')
        }
        else if (confirmPasswordError && confirmPasswordError.length > 0) {
            setFormError('error, please check the "confirm password" field')
        }
    },[nameError, userNameError,passwordError, confirmPasswordError])

    useEffect(()=>{
        setIsSubmiting(false)
    }, [name, userName, password, confirmPassword, active, loayal])

    useEffect(()=>{
        getUser()
    }, [])
 
    return (
        <div className='form-wrapper1 add-product-form'>
            <form action="" className='form1' onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-container">
                    <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />:
                            <NameField state={name} setState={setName} setError={setNameError} error={nameError} />
                        }
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />:
                            <UserNameField state={userName} setState={setUserName} setError={setUserNameError} error={userNameError} /> 
                        }
                    </div>
                    <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />:
                            <PasswordField state={password} setState={setPassword} setError={setPasswordError} error={passwordError} /> 
                        }
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />: 
                            <ConfirmPasswordField state={confirmPassword} setState={setConfirmPassword} password={password} setError={setConfirmPasswordError} error={confirmPasswordError} />
                        }
                    </div>
                    { type === 'client' ?
                     <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />:
                            <IsActiveField state={active} setState={setActive}/>
                        }
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />:
                            <IsLoyalField state={loayal} setState={setLoyal}/>
                        }
                    </div> : null}
                    <div className="form-line">
                        <div className="submit-wrapper">
                            <button type="submit" >Update</button>
                        </div>
                    </div>
                    {formError && IsSubmiting ? <div className="form-line">
                        <div className="form-error-wrapper">
                            <p>{formError}</p>
                        </div>
                    </div> : null }
                </div>
            </form>
        </div>
    )
}

export default EditClientForm