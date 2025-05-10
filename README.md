# Course-Portal


# Course-Portal
# Institute Management System

A full-stack MERN application for managing student details, course information, and payment records. Built with React, Node.js, Express, and MongoDB.

## 🌐 Technologies Used

* **Frontend**: React.js
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **API**: RESTful APIs using Express

## 📁 Project Structure

```
project-root/
│
├── sbs-school/           # React Frontend
│   └── npm start         # Starts the React development server
│
├── api/                  # Node + Express Backend
│   └── npm start         # Starts the Node.js/Express server
│
└── README.md             # Project documentation
```

## 🚀 Features

* View student list with details
* View course list
* Add new student with a form
* Add new course with a form
* Manage payment information

## 💠 Setup Instructions

### Prerequisites

* Node.js and npm
* MongoDB running locally or on the cloud

### 1. Clone the Repository

```bash
git clone https://github.com/Gayatri@132005/institute-management.git
cd institute-management
```

### 2. Install Dependencies

#### For Backend (API)

```bash
cd api
npm install
```

#### For Frontend (React)

```bash
cd ../sbs-school
npm install
```

### 3. Run the Project

In one terminal:

```bash
cd api
npm start
```

In another terminal:

```bash
cd sbs-school
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the `api/` folder and add your MongoDB URI:

```env
MONGO_URI=your-mongodb-connection-uri
PORT=5000
```

## 📷 Screenshots

![alt text](<React App - Profile 1 - Microsoft​ Edge 10-05-2025 02_19_44 PM.png>)

![alt text](<React App - Profile 1 - Microsoft​ Edge 10-05-2025 02_20_20 PM.png>)


![alt text](<React App - Profile 1 - Microsoft​ Edge 10-05-2025 02_20_32 PM.png>)

![alt text](<React App - Profile 1 - Microsoft​ Edge 10-05-2025 02_20_42 PM.png>)


## 🧑‍💻 Author

* Gayatri Kotwal

## 📃 License

This project is open source and available under the [MIT License](LICENSE).
