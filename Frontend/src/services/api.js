import axios from "axios";

const prod = false;
const api = axios.create({
  baseURL: prod ? "http://thematic-garage-276021.rj.r.appspot.com" : "http://localhost:8080",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export default api;

export const fetchAnswers = (payload) => api.post("/answer", payload);
export const fetchProducts = () => api.get("/products");
export const fetchQuestions = (productId) => api.get(`/questions?product_id=${productId}`);
export const fetchRandomQuestions = (count) => api.get(`/questions/random?resPerPage=${count}`);
export const fetchAwaitingQuestionsCount = () => api.get(`/questions/awaiting/count`);


export const createQuestion = (payload) => api.post("/questions", payload);
export const answerQuestion = (productId, questionId, payload) =>
  api.patch(
    `/questions/answer?product_id=${productId}&question_id=${questionId}`,
    payload
  );
export const createProduct = (payload) => api.post("/products", payload);
export const removeProduct = (payload) => api.delete(`/products?product_id=${payload}`);

export const userData = {
  login: (payload) => api.post("/login", payload),
  register: (payload) => api.post("/register", payload),
};
