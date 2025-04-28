import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';
export const Signup = () => {

  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
 const [isLoading, setLoading]=useState(false);



  const navigate=useNavigate();

  const submithandler = (event) => {
    event.preventDefault();
  setLoading(true);
    const formData = new FormData(); 

    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("image", image);

    axios.post("http://localhost:4200/user/signup", formData)
      .then(res => {
         setLoading(false);
         toast.success("congratulation account is successfully")
          navigate('/login')
        console.log("Server response:", res.data);
      })
      .catch(err => {
         setLoading(false)
         toast.error("something is wrong");

        console.error(" Error during signup:", err);
      });
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img alt="book logo" src={require('../assets/book logo.png')} />
        </div>
        <div className="signup-right">
          <form onSubmit={submithandler} className="form">
            <h1>Create Account</h1>
            <input required
              onChange={e => setFullName(e.target.value)}
              type="text"
              placeholder="Institute Full Name"
              value={fullName}
            />
            <input required
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
            />
            <input  required
              onChange={e => setPhone(e.target.value)}
              type="text"
              placeholder="Phone"
              value={phone}
            />
            <input  required
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
            />
            <input  required
              onChange={fileHandler}
              type="file"
              accept="image/*"
            />
            {imageUrl && (
              <img className="your-logo" alt="your logo" src={imageUrl} />
            )}
            <button type="submit">{isLoading &&<i class="fas fa-spinner fa-pulse"></i>}Submit</button>
   
            <Link  className="link" to="/login">Login with your account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
