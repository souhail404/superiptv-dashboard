import React, { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify'; 
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const NameField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false); 
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Name is Required');
            } else if (state.length < 2 || state.length > 50) {
                setError('Name must be between 2 and 50 characters');
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
            <label htmlFor="link-name">Name :</label>
            <input  type="text" 
                    className='input1' 
                    name='link-name' 
                    id='link-name' 
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const LinkField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Link is Required');
            } else if (state.length < 1 || state.length > 150) {
                setError('Link must be between 1 and 150 characters');
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
            <label htmlFor="link-link">Link :</label>
            <input  type="text" 
                    className='input1' 
                    name='link-link' 
                    id='link-link' 
                    required
                    value={state} 
                    onChange={(e)=>{setState(e.target.value)}} 
                    onBlur={()=>setTouched(true)} />
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const CategoryField = ({ state, setState , setError, error}) =>{

    const [touched, setTouched] = useState(false);
    
    const validate = useCallback(
        debounce(() => {
            if (!state) {
                setError('Category is Required');
            } 
            else {
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
            <label htmlFor="link-category">Category :</label>
            <select 
                name="link-category" 
                id="link-category"
                className='input1 select'
                value={state} 
                onChange={(e)=>{setState(e.target.value)}} 
                onBlur={()=>setTouched(true)}
                >
                <option value="">---Select---</option>
                <option value="playlist">playlist</option>
                <option value="application">application</option>
                <option value="panel">panel</option>
            </select>
                    
            {(error && touched ) ? <div className='input-error'> * {error}</div> : null}
        </div>
    )
}

const ImageField = ({state, setState, prevImagePreview, setPrevImagePreview}) =>{

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setPrevImagePreview(null)
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
            {prevImagePreview && <img src={prevImagePreview.url} alt="Preview" className='input-file-preview' />}       
        </div>
    ) 
} 

const EditLinkForm = () => {
    const {linkId} = useParams()
    const { user } = useAuthContext()

    // data states
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState(null);
    const [prevImagePreview, setPrevImagePreview] = useState(null);

    // error states
    const [nameError, setNameError] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [linkError, setLinkError] = useState(null);
    const [formError, setFormError] = useState(null);
    // general states
    const [IsSubmiting, setIsSubmiting] = useState(false);
    const [IsFetching, setIsFetching] = useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setIsSubmiting(true)

        if (formError===null) {
            const toastId = toast.loading("Updating Link...");

            // Create FormData object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('category', category);
            formData.append('link', link);
            formData.append('image', image); 

            const response = await fetch(`/api/link/update/${linkId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`,
                },
                body: formData
            });

            const json = await response.json();

            if (response.ok) {
                toast.update(toastId, { render: "Link Updated Succesfully", type: "success", isLoading: false, autoClose: 4000 });
                // navigate('/link');

            } else {
                toast.update(toastId, { render: `${json.message}`, type: "error", isLoading: false, autoClose: 4000 });
            }

        }   
    }

    const getLink = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/link/${linkId}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {link} = response;
              setName(link.name);
              setCategory(link.category);
              setLink(link.link);
              setPrevImagePreview(link.image)
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
            setFormError('error, please check the "name" field')
        }
        else if (linkError && linkError.length > 0) {
            setFormError('error, please check the "link" field')
        }
        if (categoryError && categoryError.length > 0) {
            setFormError('error, please check the "category" field')
        }
        
    },[nameError, linkError, categoryError])

    useEffect(()=>{
        setIsSubmiting(false)
    }, [name, link, category])
    
    useEffect(()=>{
        getLink()
    }, [])

    return (
        <div className='form-wrapper1 add-product-form'>
            <form action="" className='form1' onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-container">
                    <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />
                            : <CategoryField state={category} setState={setCategory} error={categoryError} setError={setCategoryError} />
                        }
                        {
                            IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />
                            : <NameField state={name} setState={setName} error={nameError} setError={setNameError} />
                        }
                    </div>
                    <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={60} width={'100%'} />
                            : <LinkField state={link} setState={setLink} error={linkError} setError={setLinkError} />
                        }
                         
                    </div>
                    <div className="form-line">
                        {IsFetching ? <Skeleton animation='wave' height={120} width={'100%'} />
                            : <ImageField state={image} setState={setImage} prevImagePreview={prevImagePreview} setPrevImagePreview={setPrevImagePreview} /> 
                        }
                        
                    </div>
                    <div className="form-line">
                        <div className="submit-wrapper">
                        <button type="submit" >Update Link</button>
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

export default EditLinkForm