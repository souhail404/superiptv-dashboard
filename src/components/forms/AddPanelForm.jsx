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
            <label htmlFor="panel-name">Title :</label>
            <input  type="text" 
                    className='input1' 
                    name='panel-name' 
                    id='panel-name' 
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const QuantityField = ({ state, setState , setError, error}) =>{

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
            <label htmlFor="panel-quantity">quantity :</label>
            <input  type="number" 
                    className='input1' 
                    name='panel-quantity' 
                    id='panel-quantity'
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
                setError('Normal Price is Required');
            } else if (state < 0) {
                setError('Normal Price Must Be Positif');
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
            <label htmlFor="panel-price">normal price :</label>
            <input  type="number" 
                    className='input1' 
                    name='panel-price' 
                    id='panel-price' 
                    min={0}
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const SpecialPriceField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Special Price is Required');
            } else if (state < 0) {
                setError('Special Price Must Be Positif');
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
            <label htmlFor="panel-specialPrice">special price :</label>
            <input  type="number" 
                    className='input1' 
                    name='panel-specialPrice' 
                    id='panel-specialPrice' 
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
            <label htmlFor="panel-image" className='input-file-label'>click here to upload image</label>
            <input  type="file" 
                    className='input-file1' 
                    name='panel-image' 
                    id='panel-image' 
                    accept='image/*'
                    onChange={(e)=> handleImageChange(e)}
                     />
            {imagePreview && <img src={imagePreview} alt="Preview" className='input-file-preview' />}       
        </div>
    ) 
} 

const AddPanelForm = () => {
    const { user } = useAuthContext()
    const navigate = useNavigate()

    // data states
    const [title, setTitle] = useState('');
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [specialPrice, setSpecialPrice] = useState();
    const [image, setImage] = useState(null);
    // error states
    const [titleError, setTitleError] = useState(null);
    const [quantityError, setQuantityError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [specialPriceError, setSpecialPriceError] = useState(null);
    const [formError, setFormError] = useState(null);
    // general states
    const [IsSubmiting, setIsSubmiting] = useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setIsSubmiting(true)

        if (formError===null) {
            const toastId = toast.loading("Creating New Panel...");

            // Create FormData object
            const formData = new FormData();
            formData.append('title', title);
            formData.append('quantity', quantity);
            formData.append('price', price);
            formData.append('specialPrice', specialPrice);
            formData.append('image', image); 

            const response = await fetch('/api/panel/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: formData
            });

            const json = await response.json();

            if (response.ok) {
                toast.update(toastId, { render: "Panel Created Succesfully", type: "success", isLoading: false, autoClose: 4000 });
                navigate('/panels');

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
        if (specialPriceError && specialPriceError.length > 0) {
            setFormError('error, please check the "special price" field')
        }
        else if (quantityError && quantityError.length > 0) {
            setFormError('error, please check the "quantity" field')
        }
        
    },[titleError, priceError,quantityError, specialPriceError])

    useEffect(()=>{
        setIsSubmiting(false)
    }, [title, price, quantity, specialPrice])
 
    return (
        <div className='form-wrapper1 add-product-form'>
            <form action="" className='form1' onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-container">
                    <div className="form-line">
                        <TitleField state={title} setState={setTitle} error={titleError} setError={setTitleError} />
                    </div>
                    <div className="form-line">
                        <QuantityField state={quantity} setState={setQuantity} error={quantityError} setError={setQuantityError} /> 
                        <PriceField state={price} setState={setPrice} error={priceError} setError={setPriceError} />
                        <SpecialPriceField state={specialPrice} setState={setSpecialPrice} error={specialPriceError} setError={setSpecialPriceError} />
                    </div>
                    <div className="form-line">
                        <ImageField state={image} setState={setImage} /> 
                    </div>
                    <div className="form-line">
                        <div className="submit-wrapper">
                        <button type="submit" >Add Panel</button>
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

export default AddPanelForm