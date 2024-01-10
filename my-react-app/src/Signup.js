import React, {useState} from 'react'
import { Link } from 'react-router-dom' 
import { useNavigate } from "react-router-dom";
import Validation from './SignupValidation';
import axios from 'axios'
import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';





function Signup() {

    const[values, setValues] = useState({
        name: '',
        email: '',
        password: ''
      })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const handleInput = (event)=> {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
      }
    
    const handleSubmit = (event)=> {
      event.preventDefault();
      setErrors(Validation(values));
      if(errors.name === "" && errors.email === "" && errors.password === "") {
        axios.post('http://localhost:8081/signup', values)
        .then(res => {
            navigate('/');
        })
        .catch(err => console.log(err));
      }
    }

  return (
    <body class="font-link" style={{background:"#FF9292"}}>
      {/* Main Container */}
      <div class="container d-flex justify-content-center align-items-center min-vh-100">
      {/*Login Container */}
        <div class="row border rounded-5 p-3 bg-white shadow box-area">

      {/*Left Box */}

        <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
          <div id="demo" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
              <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            </div>
            
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={image1} alt="orange" class="d-flex border rounded-4" style={{width:"100%", marginTop:"10px"}} />
              </div>
              <div class="carousel-item">
                <img src={image2} alt="orange" class="d-flex border rounded-4" style={{width:"100%", marginTop:"10px"}} />
              </div>
              <div class="carousel-item">
                <img src={image3} alt="orange" class="d-flex border rounded-4" style={{width:"100%", marginTop:"10px"}} />
              </div>
            </div>
          </div>
          <p class="fs-3 " style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: 600 , marginTop:"20px", color:"#FF9292"}}>Create your own flashcard</p>
        </div> 

      {/*Right Box */}
        <div class="col-md-6 right-box">
            <form action='' onSubmit={handleSubmit} class="row align-items-center">
                  <div class="header-text mb-4">
                      <h2 class="fs-1" style={{color:"#FF9292"}}><strong>Welcome</strong></h2>
                      <p>We are happy to have you here.</p>
                  </div>
                  <div class="input-group mb-3">
                      <input type='name' placeholder='Name' name='name' 
                      onChange={handleInput} className='form-control form-control-lg bg-light fs-6'/>
                      {errors.name && <span className='text-danger'>{errors.name}</span>}
                  </div>
                  <div class="input-group mb-3">
                      <input type='email' placeholder='Email' name='email' 
                      onChange={handleInput} className='form-control form-control-lg bg-light fs-6'/>
                      <div>
                      {errors.email && <span className='text-danger'>{errors.email}</span>}
                      </div>
                  </div>
                  <div class="input-group mb-1">
                      <input type='password' placeholder='Password' name='password'
                      onChange={handleInput} className="form-control form-control-lg bg-light fs-6"/>
                      {errors.password && <span className='text-danger'>{errors.password}</span>}
                  </div>
                  <div class="input-group mb-3">
                      <button type='submit' className="btn btn-lg btn-primary w-100 fs-6 " id="loginBnt"style={{marginTop:"10px"}}><strong>Sign up</strong></button>
                  </div>
                  <div class="input-group mb-3">
                    <small>You are agree to out terms and policies</small>
                    <small>Haven't you already had account? <Link to="/">Log in</Link> </small>
                  </div>
                  
            </form>
        </div> 
        </div>
      </div>
    </body>
  )
}

export default Signup