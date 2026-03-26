import { Navigate, Route, Routes } from "react-router-dom";
import CreatePostPage from "../pages/CreatePostPage";
import LoginPage from "../pages/LoginPage";
import PostsPage from "../pages/PostsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/new" element={<CreatePostPage />} />
    </Routes>
  );
}
