import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import Validation from './LoginValidation'
import './Login.css';
import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');
const loginFilePath = path.join(__dirname, 'login.txt');

const saveLoginData = async (data) => {
  try {
    await fs.writeFile(loginFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving login data:', error);
  }
};

const getLoginData = async () => {
  try {
    const content = await fs.readFile(loginFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading login data:', error);
    return [];
  }
};

const createLoginFile = async () => {
  try {
    await fs.writeFile(loginFilePath, '[]');
    console.log(`Created login file: ${loginFilePath}`);
  } catch (error) {
    console.error('Error creating login file:', error);
  }
};

// Check if login file exists, if not, create it
fs.access(loginFilePath)
  .catch(() => createLoginFile())
  .then(() => {
    app.post('/signup', async (req, res) => {
      const { name, email, password } = req.body;
      const loginData = await getLoginData();
      const newUserData = { id: loginData.length + 1, name, email, password };
      loginData.push(newUserData);
      await saveLoginData(loginData);
      res.json(newUserData);
    });

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const loginData = await getLoginData();
      const user = loginData.find((userData) => userData.email === email && userData.password === password);
      if (user) {
        res.json({ status: "Success", id: user.id });
      } else {
        res.json("Fail");
      }
    });

    const port = 5432 || process.env.PORT;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

function Login() {
  const[values, setValues] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
const [errors, setErrors] = useState({})
const handleInput = (event)=> {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  const handleSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    setErrors(Validation(values));
    if (errors.email === "" && errors.password === "") {
      const loginData = getLoginData();
      const user = loginData.find((userData) => userData.email === values.email && userData.password === values.password);
      if (user) {
        navigate(`user/${user.id}/home`);
      } else {
        alert("No record existed");
      }
    }
  };

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
                      <h2 class="fs-1" style={{color:"#FF9292"}}><strong>Hello,Again</strong></h2>
                      <p>We are happy to have you back.</p>
                  </div>
                  <div class="input-group mb-3">
                      <input type='email' placeholder='Email' name='email' 
                      onChange={handleInput} className='form-control form-control-lg bg-light fs-6'/>
                      {errors.email && <span className='text-danger'>{errors.email}</span>}
                  </div>
                  <div class="input-group mb-1">
                      <input type='password' placeholder='Password' name='password'
                      onChange={handleInput} className="form-control form-control-lg bg-light fs-6"/>
                      {errors.password && <span className='text-danger'>{errors.password}</span>}
                  </div>
                  <div class="input-group mb-5 d-flex justify-content-between" style={{marginTop:"10px"}}>
                      <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="formCheck"/>
                          <label for="formCheck" class="form-check-label text-secondary"><small>Remember Me</small></label>
                      </div>
                      <div class="forgot">
                          <small>Forgot Password?</small>
                      </div>
                  </div>
                  <div class="input-group mb-3">
                      <button type='submit' className="btn btn-lg btn-primary w-100 fs-6 " id="loginBnt" ><strong>Login</strong></button>
                  </div>
                  <div class="row">
                      <small>Don't have account? <Link to="/signup">Sign Up</Link> </small>
                      
                  </div>
            </form>
        </div> 
        </div>
      </div>
    </body>
  )
}

export default Login