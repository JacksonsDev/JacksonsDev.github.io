# DevTask - Full-Stack Task Management Application

DevTask is a minimalist task tracking web application built to showcase practical implementation of full-stack software development skills, including frontend design, backend integration, RESTful API development, and secure user authentication. The frontend is hosted using **GitHub Pages**, the backend is deployed via **Render**, and **MongoDB Atlas** is used for cloud-based database storage.

---

## 💼 Skills Demonstrated

This project brings together a range of software engineering and web development skills acquired through academic and professional experience:

- **Frontend Development:** DOM manipulation, form handling, dynamic UI updates using JavaScript.
- **Backend Development:** REST API construction using Node.js and Express.
- **Authentication & Security:** JWT-based user login, password hashing with bcrypt, secure API routes.
- **Database Integration:** Mongoose ODM with MongoDB Atlas to persist user and task data.
- **Deployment Pipelines:**
  - Frontend: [GitHub Pages](https://pages.github.com/)
  - Backend: [Render](https://render.com/)
  - Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## ⚙️ Requirements

To run this project locally, you'll need the following installed:

- **Node.js** (v18+ recommended)
- **MongoDB Atlas account**
- **Render account** (for backend deployment)
- **Git** (for version control and deployment to GitHub)

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your secret key>
PORT=5000
