import React from 'react';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
 import Students from './components/Students';
  import AddStudent from './components/AddStudent';
  import Courses from './components/Courses';
   import AddCourses from './components/AddCourses';
    import CollectFee from './components/CollectFee';
     import PaymentHistory from './components/PaymentHistory';
     import Home from './components/Home';
      import CourseDetail from './components/CourseDetail';
     import StudentDetail from './components/StudentDetail';
 // Optional custom error component
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
 
  },
  {
    path: "/login",
    element: <Login />,
 
  },
  {
    path: "/signup",
    element: <Signup />,
   
  },
  {
    path: "/dashboard",
    Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'courses',Component:Courses},
      {path:'add-course',Component:AddCourses},
      {path:'students',Component:Students},
      {path:'add-student',Component:AddStudent},
      {path:'collect-fee',Component:CollectFee},
      {path:'payment-history',Component:PaymentHistory},
      {path:"course-detail/:id",Component:CourseDetail},
      {path:"update-course/:id",Component:AddCourses},
      {path:"update-student/:id",Component:AddStudent},

      {path:"student-detail/:id",Component:StudentDetail},
    ]
  
  }
]);

export const App = () => {
  return (
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </>
  );
};

export default App;
