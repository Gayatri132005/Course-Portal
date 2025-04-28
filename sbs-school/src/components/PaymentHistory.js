
import '../components/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
export const PaymentHistory = () => {
    const [paymentList, setPaymentList] = useState([]);
    useEffect(() => {
        getPaymentHistory();
    }, [])


    const getPaymentHistory = () => {
        axios
            .get(`http://localhost:4200/fee/payment-history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                setPaymentList(res.data.paymentHistory.reverse());


            })
            .catch((err) => {
                console.log(err);
                toast.error('Something went wrong...');
            });
    };
    return (
        <div className="payment">
            <table className="payment-table">
                <thead>
                    <tr> {/* ✅ you missed <tr> inside <thead> */}
                        <th>Student's Name</th>
                        <th>Date and Time</th>
                        <th>Amount</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((payment) => (
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
    )
}
export default PaymentHistory;