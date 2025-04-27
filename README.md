# Blog Management Application

This project is a **Blog Management System** that includes both a backend (Node.js) and a frontend (Angular). It allows users to create, edit, delete, and view blogs, while administrators have additional privileges to manage blogs and users.

---

Link For Backend: https://github.com/sattvikdwivedi/Blog-Backend

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or later)
- **Angular CLI** (v15 or later)
- **MongoDB** (for backend database)
- **Cloudinary Account** (for image uploads)
- **Postman** (optional, for API testing)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd BlogApp-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   JWT_SECRET=<your_jwt_secret>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd BlogApp-Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `environment.ts` file in `src/environments/` with the backend API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```
4. Start the Angular development server:
   ```bash
   ng serve
   ```
5. Open the application in your browser at `http://localhost:4200`.

---

## Thought Process / Tradeoffs

### Backend
- **Modular Design**: The backend is structured into controllers, services, and helpers for better separation of concerns.
- **Error Handling**: Used `http-errors` for consistent error responses.
- **Cloudinary Integration**: Chose Cloudinary for image uploads due to its simplicity and robust API.
- **Tradeoff**: Using Cloudinary adds a dependency on an external service, but it simplifies image management.

### Frontend
- **Component-Based Architecture**: Angular's modularity was leveraged to create reusable components like `CategoryComponent`.
- **Pagination and Filtering**: Implemented client-side filtering and pagination for better user experience.
- **SweetAlert2 and Toastr**: Used for user-friendly notifications and alerts.
- **Tradeoff**: Client-side filtering may not scale well with large datasets, but it simplifies the implementation for now.

### General
- **Authentication**: JWT-based authentication was implemented for secure user sessions.
- **Time Constraints**: Focused on core features like blog CRUD operations and user management, leaving advanced features (e.g., analytics) for future iterations.

---

## Time Taken

### Backend
- **Setup and Configuration**: 2 hours
- **API Development**: 6 hours
- **Testing and Debugging**: 2 hours

### Frontend
- **Setup and Configuration**: 1 hour
- **Component Development**: 5 hours
- **Integration with Backend**: 3 hours
- **UI Enhancements and Testing**: 2 hours

### Total Time
Approximately **21 hours**.

---

## Future Improvements
- Implement advanced search and filtering on the backend for scalability.
- Add role-based access control for more granular permissions.
- Optimize image uploads by resizing and compressing images before uploading.
- Add unit and integration tests for both frontend and backend.
- Improve UI/UX with a more modern design.

---

## License
This project is licensed under the MIT License.
