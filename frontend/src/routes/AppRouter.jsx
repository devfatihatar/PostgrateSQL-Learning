import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import CreatePostPage from "../pages/CreatePostPage";
import DeletePostPage from "../pages/DeletePostPage";
import LoginPage from "../pages/LoginPage";
import PostsPage from "../pages/PostsPage";
import RegisterPage from "../pages/RegisterPage";
import UpdatePostPage from "../pages/UpdatePostPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <PostsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/new-post"
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/update-post"
        element={
          <ProtectedRoute>
            <UpdatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/delete-post"
        element={
          <ProtectedRoute>
            <DeletePostPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
