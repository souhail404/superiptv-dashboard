import React, { useCallback, useEffect, useState } from 'react' 
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const TitleField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Title is Required');
            } else if (state.length < 2 || state.length > 50) {
                setError('Title must be between 2 and 50 characters');
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

    return(
        <div className="input-wrapper">
            <label htmlFor="server-name">Title :</label>
            <input  type="text" 
                    className='input1' 
                    name='server-name' 
                    id='server-name' 
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const PeriodField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Period is Required');
            } else if (state.length < 1 || state.length > 50) {
                setError('Period must be between 1 and 50 characters');
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

    return(
        <div className="input-wrapper">
            <label htmlFor="server-period">period :</label>
            <input  type="text" 
                    className='input1' 
                    name='server-period' 
                    id='server-period'
                    required 
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const PriceField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Price is Required');
            } else if (state < 0) {
                setError('Price Must Be Positif');
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

    return(
        <div className="input-wrapper">
            <label htmlFor="server-price">price :</label>
            <input  type="number" 
                    className='input1' 
                    name='server-price' 
                    id='server-price' 
                    min={0}
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const ImageField = ({state, setState}) =>{

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setState(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return(
        <div className="input-wrapper">
            <label htmlFor="">image :</label>
            <label htmlFor="server-image" className='input-file-label'>click here to upload image</label>
            <input  type="file" 
                    className='input-file1' 
                    name='server-image' 
                    id='server-image' 
                    accept='image/*'
                    onChange={(e)=> handleImageChange(e)}
                     />
            {imagePreview && <img src={imagePreview} alt="Preview" className='input-file-preview' />}       
        </div>
    ) 
} 

const AddServerForm = () => {
    const { user } = useAuthContext()
    const navigate = useNavigate()

    // data states
    const [title, setTitle] = useState('');
    const [period, setPeriod] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [codes, setCodes] = useState([]);
    // error states
    const [titleError, setTitleError] = useState(null);
    const [periodError, setPeriodError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [formError, setFormError] = useState(null);
    // general states
    const [IsSubmiting, setIsSubmiting] = useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setIsSubmiting(true)

        if (formError===null) {
            const toastId = toast.loading("Creating New Product...");

            // Create FormData object
            const formData = new FormData();
            formData.append('title', title);
            formData.append('period', period);
            formData.append('price', price);
            formData.append('image', image); 

            // Handle arrays
            const codesArray = codes.length > 0 ? codes.split(/\n/) : [];
            // Remove empty strings from the codesArray
            const filteredCodesArray = codesArray.filter(code => code.trim() !== "");

            filteredCodesArray.forEach((code, index) => {
                formData.append(`codes[${index}]`, code);
            });

            const response = await fetch('/api/server/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: formData
            });

            const json = await response.json();

            if (response.ok) {
                toast.update(toastId, { render: "Server Created Succesfully", type: "success", isLoading: false, autoClose: 4000 });
                navigate('/servers');

            } else {
                toast.update(toastId, { render: `${json.message}`, type: "error", isLoading: false, autoClose: 4000 });
            }

        }   
    }

    useEffect(()=>{
        setFormError(null)

        if (titleError && titleError.length > 0) {
            setFormError('error, please check the "title" field')
        }
        else if (priceError && priceError.length > 0) {
            setFormError('error, please check the "price" field')
        }
        else if (periodError && periodError.length > 0) {
            setFormError('error, please check the "period" field')
        }
        
    },[titleError, priceError,periodError])

    useEffect(()=>{
        setIsSubmiting(false)
    }, [title, price, period])
 
    return (
        <div className='form-wrapper1 add-product-form'>
            <form action="" className='form1' onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-container">
                    <div className="form-line">
                        <TitleField state={title} setState={setTitle} error={titleError} setError={setTitleError} />
                    </div>
                    <div className="form-line">
                        <PeriodField state={period} setState={setPeriod} error={periodError} setError={setPeriodError} /> 
                        <PriceField state={price} setState={setPrice} error={priceError} setError={setPriceError} />
                    </div>
                    <div className="form-line">
                        <ImageField state={image} setState={setImage} /> 
                    </div>
                    <div className="form-line">
                        <div className="input-wrapper">
                        <label htmlFor="server-codes">Codes :</label>
                        <textarea className='input1' name='server-codes' id='server-codes' value={codes} onChange={(e)=>setCodes(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="form-line">
                        <div className="submit-wrapper">
                        <button type="submit" >Add Server</button>
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

export default AddServerForm