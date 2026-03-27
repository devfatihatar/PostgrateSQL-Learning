const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthToken() {
  return localStorage.getItem("token");
}

function getCurrentUserId() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload.userId || null;
  } catch {
    return null;
  }
}

// Tek bir yerden request atmak, endpoint'leri yonetmeyi kolaylastirir.
async function request(path, options = {}) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error || "Bir hata olustu");
    error.details = data?.details || [];
    throw error;
  }

  return data;
}

// Post listeleme icin tek sorumlu fonksiyon.
export function getPosts(queryString = "") {
  const normalizedQuery = queryString ? `?${queryString}` : "";
  return request(`/posts${normalizedQuery}`);
}

// Login icin email ve sifreyi backend'e yollar.
export function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Register icin email ve sifreyi backend'e yollar.

export function register(credentials) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

// Auth gereken post olusturma istegi.
export function createPost(postData) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export function deletePost(postId) {
  return request(`/posts/${postId}`, {
    method: "DELETE",
  });
}
export { API_BASE_URL, getAuthToken, getCurrentUserId };
