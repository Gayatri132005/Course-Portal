import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});
    const [paymentList, setPaymentList] = useState([]);
    const [course, setCourse] = useState({});

    useEffect(() => {
        const getStudentDetail = () => {
            axios
                .get(`https://course-portal-3.onrender.com/student/student-detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    setStudent(res.data.studentDetail);
                    setPaymentList(res.data.feeDetail);
                    setCourse(res.data.courseDetail);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Something went wrong...');
                });
        };
        getStudentDetail();
    }, [id]);

    const deleteStudent = (studentId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            axios
                .delete(`https://course-portal-3.onrender.com/student/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    navigate('/dashboard/course-detail/' + course._id);
                    toast.success("Student Data deleted successfully");
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Something went wrong...");
                });
        }
    };

    return (
        <div className="student-detail-main-wrapper">
            <div className="student-detail-wrapper">
                <div className="student-detail-header">
                    <h2>Student Full Detail</h2>
                    <div className="sd-btn-container">
                        <button
                            className="btn-edit"
                            onClick={() =>
                                navigate(`/dashboard/update-student/${student._id}`, { state: { student } })
                            }
                        >
                            Edit
                        </button>
                        <button className="btn-delete" onClick={() => deleteStudent(student._id)}>
                            Delete
                        </button>
                    </div>
                </div>
                <div className="sd-detail">
                    <img
                        src={student.imageUrl}
                        alt={student.fullName}
                        className="sd-detail-image"
                    />
                    <div className="sd-info">
                        <h2>{student.fullName}</h2>
                        <p>Phone:- {student.phone}</p>
                        <p>Email:- {student.email}</p>
                        <p>Address:- {student.address}</p>
                        <h4>CourseName:- {course.courseName}</h4>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <h1 className="payment-history-title">Payment History</h1>
            <div className="fee-detail-wrapper">
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Amount</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentList.map((payment) => (
                            <tr key={payment._id}>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                <td>₹ {payment.amount}</td>
                                <td>{payment.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDetail;
