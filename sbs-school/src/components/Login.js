import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';

export const Login= () => {

  const [email, setEmail] = useState("");
 
  const [password, setPassword] = useState('');
 
 const [isLoading, setLoading]=useState(false);



  const navigate=useNavigate();

  const submithandler = (event) => {
    event.preventDefault();
  setLoading(true);
    
     

    axios.post("http://localhost:4200/user/login",{
       email:email,
       password:password
    })
      .then(res => {
         setLoading(false);
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('fullName',res.data.fullName)
        localStorage.setItem('imageUrl',res.data.imageUrl)
        localStorage.setItem('imageId',res.data.imageId)
        localStorage.setItem('email',res.data.email)
          navigate('/dashboard')
        console.log("Server response:", res.data);
      })
      .catch(err => {
         setLoading(false)
         toast.error("something is wrong");

        console.error(" Error during signup:", err);
      });
  };

  
  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img alt="book logo" src={require('../assets/book logo.png')} />
        </div>
        <div className="signup-right">
          <form onSubmit={submithandler} className="form">
            <h1>Login With  Account</h1>
           
            <input required
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
            />
           
            <input  required
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
            />
            <button type="submit">{isLoading &&<i class="fas fa-spinner fa-pulse"></i>}Submit</button>
            <Link className="link" to="/signup">Create your Account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
