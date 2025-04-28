import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';

export const Home = () => {
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();
  
  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = () => {
    axios
      .get(`http://localhost:4200/course/home`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        console.log(res.data); 
        setTotalCourse(res.data.totalCourse);
        setTotalStudent(res.data.totalStudent);
        setStudents(res.data.students);
        setFees(res.data.fees);
        setTotalAmount(res.data.totalAmount);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong...");
      });
  };
  
  return (
    <div className="home-wrapper">
      <div className="count-box-wrapper">
        <div className="box box1">
          <h2>00{totalCourse}</h2>
          <p>Courses</p>
        </div>
        <div className="box box2">
          <h2>00{totalStudent}</h2>
          <p>Students</p>
        </div>
        <div className="box box3">
          <h2>{totalAmount}</h2>
          <p>Total Amount</p>
        </div>
      </div>
      
      <div className="list-container">
        {students.length > 0 ? (
          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student Pic</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Fees</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const studentFee = fees.find((fee) => fee.studentId === student._id);
                  return (
                    <tr key={student._id}>
                      <td className="img-cell" data-label="Student Pic">
                        <img
                          src={student.imageUrl || 'https://via.placeholder.com/80'}
                          alt={`Profile of ${student.fullName}`}
                          width="80"
                          height="80"
                        />
                      </td>
                      <td data-label="Name">{student.fullName}</td>
                      <td data-label="Phone">{student.phone}</td>
                      <td data-label="Email">{student.email}</td>
                      <td data-label="Fees">{studentFee ? studentFee.amount : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No students found.</p>
        )}

        {fees.length > 0 ? (
          <div className="table-container">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Student's Name</th>
                  <th>Date and Time</th>
                  <th>Amount</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((payment) => (
                  <tr key={payment._id}>
                    <td data-label="Student's Name">{payment.fullName}</td>
                    <td data-label="Date and Time">{new Date(payment.createdAt).toLocaleString()}</td>
                    <td data-label="Amount">₹ {payment.amount}</td>
                    <td data-label="Remark">{payment.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No fee records found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;