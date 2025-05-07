import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';

export const CourseDetail = () => {
  const [course, setCourse] = useState({});
  const [studentList, setStudentList] = useState([]);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getCourseDetail();
  }, []);

  const getCourseDetail = () => {
    axios.get(`https://course-portal-3.onrender.com/course/course-detail/${params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        console.log(res.data);
        console.log(res.data.studentsList);
        setCourse(res.data.courses);
        setStudentList(res.data.studentsList);
      })
      .catch(err => {
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`https://course-portal-3.onrender.com/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/courses'); // Redirect after successful deletion
          toast.success("Course deleted successfully");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong...");
        });
    }
  };

  return (
    <div className="course-detail-main-wrapper">
      {/* Course Detail Card */}
      <div className="course-detail-wrapper">
        <img className="course-thumbnail" src={course.imageUrl} alt="Course" />
        
        <div className="course-detail">
          <b><p>{course.courseName}</p></b>
          <p>Price: {course.price}</p>
          <p>Starting Date: {course.startingDate}</p>
          <p>End Date: {course.endDate}</p>

          {/* Description inside the box */}
          <div className="description-box">
            <b><h>Course Description</h></b>
            <p>{course.description}</p>
          </div>

          {/* Buttons inside the box */}
          <div className="button-group">
            <button className="btn-edit" onClick={() => {
              navigate('/dashboard/add-course', { state: { course } })
            }}>Edit</button>
            <button className="btn-delete" onClick={() => deleteCourse(course._id)}>Delete</button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="student">
        {studentList.length > 0 ? (
          <div className="students-container">
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
                    <td>
                      <img
                        src={student.imageUrl || 'https://via.placeholder.com/80'}
                        alt={`Profile of ${student.fullName}`}
                        width="80"
                        height="80"
                      />
                    </td>
                    <td>{student.fullName}</td>
                    <td>{student.phone}</td>
                    <td>{student.email}</td>
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
  );
};

export default CourseDetail;
