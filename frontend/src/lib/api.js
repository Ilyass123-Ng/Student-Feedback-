import axios from 'axios';

// --- Configuration des URLs des Microservices ---
// Kan-akhdu les URLs men les variables d'environnement (.env)
const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080/api/auth';
const COURS_BASE = process.env.NEXT_PUBLIC_COURS_SERVICE_URL || 'http://localhost:4000/api/courses';
const FEEDBACK_BASE = process.env.NEXT_PUBLIC_FEEDBACK_SERVICE_URL || 'http://localhost:5000/api/feedback';

// Helper bach n-ziydou l-Token f l-Headers (Authentication)
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : null}` }
});

// --- Axios Interceptor ---
// Hada kay-traité l'réponse dial l'API bach n-khdmo ghir b l'Data li bghina
axios.interceptors.response.use(
  (response) => {
    // Ila kant l'API raj3at success: true, kan-unwrappiw l-data
    if (response.data && response.data.success === true) {
      if (response.data.hasOwnProperty('data')) {
        return { ...response, data: response.data.data };
      }
      if (response.data.hasOwnProperty('token')) {
        return { ...response, data: { token: response.data.token } };
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ─── Authentification ──────────────────────────────────
export const registerUser = (data) =>
  axios.post(`${AUTH_BASE}/register`, data);

export const loginUser = (data) =>
  axios.post(`${AUTH_BASE}/login`, data);

export const getProfile = () =>
  axios.get(`${AUTH_BASE}/profile`, authHeaders());

export const updateProfile = (data) =>
  axios.put(`${AUTH_BASE}/updateProfile`, data, authHeaders());

// ─── Gestion des Cours ─────────────────────────────────
export const getCourses = (page = 1, limit = 9) =>
  axios.get(`${COURS_BASE}/all?page=${page}&limit=${limit}`);

export const searchCourses = (title) =>
  axios.get(`${COURS_BASE}/search?title=${title}`);

export const getCourseById = (id) =>
  axios.get(`${COURS_BASE}/getById/${id}`);

export const getCoursesByCategory = (category) =>
  axios.get(`${COURS_BASE}/getByCategory?category=${category}`);

export const addCourse = (data) =>
  axios.post(`${COURS_BASE}/add`, data, authHeaders());

export const updateCourse = (id, data) =>
  axios.put(`${COURS_BASE}/update/${id}`, data, authHeaders());

export const deleteCourse = (id) =>
  axios.delete(`${COURS_BASE}/delete/${id}`, authHeaders());

// ─── Feedbacks & Avis ──────────────────────────────────
export const addFeedback = (title, data) =>
  axios.post(`${FEEDBACK_BASE}/${encodeURIComponent(title)}`, data, authHeaders());

export const getFeedbackByCourse = (title) =>
  axios.get(`${FEEDBACK_BASE}/${encodeURIComponent(title)}`, authHeaders());

export const updateFeedback = (title, data) =>
  axios.put(`${FEEDBACK_BASE}/${encodeURIComponent(title)}`, data, authHeaders());

export const deleteFeedback = (title, data) =>
  axios.delete(`${FEEDBACK_BASE}/${encodeURIComponent(title)}`, { ...authHeaders(), data });

export const getTopCourses = () =>
  axios.get(`${FEEDBACK_BASE}/topCourses`, authHeaders());

export const getStudentFeedback = () =>
  axios.get(`${FEEDBACK_BASE}/getStudentFeedback`, authHeaders());
