# LeadDesk Mini

A full-stack MERN application built for the Digital Heroes Training Task, designed for seamless lead capture and management.

## 🚀 Deliverables
* **Live Frontend (Vercel):** [Insert Live Vercel Link]
* **Live Backend API (Render):** [Insert Live Render Link]
* **Loom Walkthrough:** [Insert Loom Video Link]
* **Test Credentials (Admin):**
  * **Email:** vedang@admin.com
  * **Password:** secrettt

---

## 🛠 Tech Stack
* **Frontend:** React.js, Vite, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🗄️ Data Model
The application uses MongoDB to store lead submissions. The primary `Lead` schema is structured as follows:
* `name` (String, Required): The full name of the lead.
* `email` (String, Required): The contact email address.
* `budgetRange` (String, Required): The selected budget tier for the project.
* `message` (String, Required): Additional context or inquiry details.
* `status` (String, Enum): Tracks the lead's progress. Defaults to `'New'`. Other valid states are `'Contacted'` and `'Closed'`.
* `createdAt` / `updatedAt` (Timestamps): Automatically managed by Mongoose.

---

## 🔒 Authentication Approach
The admin dashboard is protected by a robust authentication system designed for a decoupled cross-origin architecture:
* **JWT Sessions:** Upon successful login, the backend generates a JSON Web Token (JWT).
* **Secure Cookies:** Instead of storing the token in `localStorage` (which is vulnerable to XSS attacks), the JWT is delivered to the client via an `httpOnly` cookie.
* **Cross-Origin Configuration:** Because the frontend (Vercel) and backend (Render) live on different domains, the authentication cookie is configured with `sameSite: 'none'` and `secure: true`. 
* **CORS Policy:** The Express backend strictly accepts credentials (`credentials: true`) only from the defined frontend origin (`CLIENT_URL` env variable), preventing CSRF and unauthorized API access.

---

## ⚙️ Local Development

**1. Clone the repository**
```bash
 https://github.com/vedang2247/LeadDesk-Mini.git
