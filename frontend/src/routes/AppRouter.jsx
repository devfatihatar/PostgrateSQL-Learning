import { Navigate, Route, Routes } from "react-router-dom";
import CreatePostPage from "../pages/CreatePostPage";
import DeletePostPage from "../pages/DeletePostPage";
import LoginPage from "../pages/LoginPage";
import PostsPage from "../pages/PostsPage";
import RegisterPage from "../pages/RegisterPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/new-post" element={<CreatePostPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/posts/delete-post" element={<DeletePostPage />} />
    </Routes>
  );
}
