import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../components/style.css";

export const AddCourses = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state && location.state.course;
  const courseId = isEditing ? location.state.course._id : null;

  useEffect(() => {
    if (isEditing) {
      const course = location.state.course;
      setCourseName(course.courseName);
      setDescription(course.description);
      setPrice(course.price);
      setStartingDate(course.startingDate);
      setEndDate(course.endDate);
      setImageUrl(course.imageUrl);
    } else {
      setCourseName("");
      setDescription("");
      setPrice(0);
      setStartingDate("");
      setEndDate("");
      setImageUrl("");
    }
  }, [location]);

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("startingDate", startingDate);
      formData.append("endDate", endDate);
      if (image) formData.append("image", image);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const baseUrl = "https://course-portal-3.onrender.com";

      if (isEditing) {
        await axios.put(`${baseUrl}/course/${courseId}`, formData, config);
        toast.success("Course updated successfully!");
      } else {
        await axios.post(`${baseUrl}/course/add-course`, formData, config);
        toast.success("Course added successfully!");
      }

      navigate("/dashboard/courses");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="form">
        <h1>{isEditing ? "Edit Course" : "Add New Course"}</h1>

        <input
          required
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course Name"
          type="text"
        />
        <input
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          type="text"
        />
        <input
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
        />
        <input
          required
          value={startingDate}
          onChange={(e) => setStartingDate(e.target.value)}
          placeholder="Starting Date (DD-MM-YY)"
          type="text"
        />
        <input
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          type="text"
        />
        <input
          onChange={fileHandler}
          type="file"
        />

        {imageUrl && (
          <img className="your-logo" alt="Course preview" src={imageUrl} width="200px" />
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : ""} Submit
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
