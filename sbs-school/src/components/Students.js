
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';

export const Students = () => {

  const [studentList, setStudentList] = useState([]);


  const navigate = useNavigate();
  useEffect(() => {
    getStudentList();
  }, [])

  const getStudentList = () => {
    axios.get(`http://localhost:4200/student/all-students`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {

        console.log(res.data);
        setStudentList(res.data.students);
      })
      .catch(err => {
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  return (
    <div>
      <div className="student">


        {studentList.length > 0 ? (
          <div className="studentList-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student Pic</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <tr key={student._id} onClick={() => { navigate('/dashboard/student-detail/' + student._id) }}>
                    <td data-label="Student Pic">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No students enrolled yet.</p>
        )}
      </div>

    </div>
  )
}

export default Students;