import React, { useState, useEffect } from 'react';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  const getCourses = () => {
    axios.get("https://course-portal-3.onrender.com/course/all-courses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        console.log(res.data);
        setCourseList(res.data.courses);
      })
      .catch(err => {
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="course-wrapper">
      {
        courseList.map((course) => (
          <div onClick={() => { navigate('/dashboard/course-detail/' + course._id) }} className="course-box" key={course._id}>
            <img className="course-thumbnail" src={course.imageUrl} />
            <b><p className="course-title">{course.courseName}</p></b>
            <p className="course-price">Rs. {course.price} Only</p>
          </div>
        ))
      }
    </div>
  );
};

export default Courses;
