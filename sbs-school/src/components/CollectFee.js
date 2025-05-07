import React, { useState, useEffect } from 'react';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

export const CollectFee = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    axios.get("https://course-portal-3.onrender.com/course/all-courses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setCourseList(res.data.courses);
      })
      .catch(err => {
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  const submithandler = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post("https://course-portal-3.onrender.com/fee/add-fee", {
      fullName: fullName,
      amount: amount,
      phone: phone,
      remark: remark,
      courseId: courseId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setLoading(false);
        console.log(res.data);
        toast.success("Fee paid.");
        navigate('/dashboard/payment-history');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  return (
    <div>
      <form onSubmit={submithandler} className="form">
        <h1>Collect Fee</h1>

        <input
          required
          onChange={e => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
          value={fullName}
        />
        <input
          required
          onChange={e => setPhone(e.target.value)}
          type="text"
          placeholder="Phone"
          value={phone}
        />
        <input
          required
          onChange={e => setAmount(e.target.value)}
          type="text"
          placeholder="Amount"
          value={amount}
        />
        <input
          required
          onChange={e => setRemark(e.target.value)}
          type="text"
          placeholder="Remark"
          value={remark}
        />

        <select
          disabled={location.state}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="select"
          required
        >
          <option value="">Select Course</option>
          {courseList.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading && <i className="fas fa-spinner fa-pulse"></i>} Submit
        </button>
      </form>
    </div>
  );
}

export default CollectFee;
