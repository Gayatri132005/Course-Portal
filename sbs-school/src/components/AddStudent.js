import React, { useState, useEffect } from 'react';
import "../components/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export const AddStudents = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [courseId, setCourseId] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const student = location?.state?.student || null;
  const isEditing = Boolean(student);
  const studentId = student?._id || null;

  useEffect(() => {
    getCourses();

    if (student) {
      setFullName(student.fullName);
      setPhone(student.phone);
      setEmail(student.email);
      setAddress(student.address);
      setCourseId(student.courseId);
      setImageUrl(student.imageUrl);
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setCourseId("");
      setImageUrl("");
    }
  }, [student]);

  const getCourses = () => {
    axios.get("http://localhost:4200/course/all-courses", {
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

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("courseId", courseId);
    if (image) formData.append("image", image);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    if (isEditing) {
      axios
        .put(`http://localhost:4200/student/${studentId}`, formData, config)
        .then(res => {
          setLoading(false);
          toast.success("Student updated successfully!");
          navigate(`/dashboard/student-detail/${studentId}`); // ✅ Navigate after editing
        })
        .catch(err => {
          setLoading(false);
          console.error(err);
          toast.error("Something went wrong while updating.");
        });
    } else {
      axios
        .post("http://localhost:4200/student/add-student", formData, config)
        .then(res => {
          setLoading(false);
          toast.success("New student added.");
          navigate("/dashboard/students");// ✅ Navigate after adding
        })
        .catch(err => {
          setLoading(false);
          console.error(err);
          toast.error("Something went wrong while adding.");
        });
    }
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="form">
        <h1>{isEditing ? "Edit Student Detail" : "Add New Student"}</h1>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Student Name"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full Address"
          required
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

        <input
          required={!location.state?.student}
          type="file"
          onChange={fileHandler}
          accept="image/*"
        />

        {imageUrl && (
          <img className="your-logo" alt="Student pic" src={imageUrl} width="200px" />
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddStudents;
