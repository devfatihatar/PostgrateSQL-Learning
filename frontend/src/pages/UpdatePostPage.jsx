import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUserId, getPosts, updatePost } from "../services/api";

export default function UpdatePostPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadMyPosts() {
      try {
        setIsLoading(true);
        setError("");

        const currentUserId = getCurrentUserId();

        if (!currentUserId) {
          setError("Post guncellemek icin once giris yapman gerekiyor.");
          return;
        }

        const response = await getPosts(`authorId=${currentUserId}&page=1&limit=20`);
        const fetchedPosts = response.data || [];

        setPosts(fetchedPosts);

        if (fetchedPosts.length > 0) {
          const firstPost = fetchedPosts[0];
          setSelectedPostId(String(firstPost.id));
          setFormData({
            title: firstPost.title || "",
            content: firstPost.content || "",
            imageUrl: firstPost.imageUrl || "",
          });
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadMyPosts();
  }, []);

  function handlePostSelect(event) {
    const nextPostId = event.target.value;
    setSelectedPostId(nextPostId);
    setSuccessMessage("");

    const selectedPost = posts.find((post) => String(post.id) === nextPostId);

    if (!selectedPost) {
      return;
    }

    setFormData({
      title: selectedPost.title || "",
      content: selectedPost.content || "",
      imageUrl: selectedPost.imageUrl || "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      await updatePost(selectedPostId, formData);

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          String(post.id) === selectedPostId ? { ...post, ...formData } : post
        )
      );

      setSuccessMessage("Post basariyla guncellendi.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>AtarCMS</p>
          <h1 style={styles.title}>Post Duzenle</h1>
        </div>

        <Link style={styles.linkButton} to="/posts">
          Listeye don
        </Link>
      </section>

      <section style={styles.card}>
        {isLoading && <p style={styles.infoText}>Postlar yukleniyor...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p style={styles.infoText}>Guncelleyebilecegin bir post bulunamadi.</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <select style={styles.input} value={selectedPostId} onChange={handlePostSelect}>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>

            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="Post basligi"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              style={styles.textarea}
              name="content"
              placeholder="Post icerigi"
              value={formData.content}
              onChange={handleChange}
              rows={8}
            />

            <input
              style={styles.input}
              type="text"
              name="imageUrl"
              placeholder="Resim URL"
              value={formData.imageUrl}
              onChange={handleChange}
            />

            {formData.imageUrl && (
              <img src={formData.imageUrl} alt={formData.title} style={styles.previewImage} />
            )}

            <button style={styles.button} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guncelleniyor..." : "Postu Guncelle"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 24px 56px",
  },
  header: {
    maxWidth: "960px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "16px",
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8b6b4a",
  },
  title: {
    margin: 0,
    fontSize: "42px",
  },
  linkButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    backgroundColor: "#2f241b",
    color: "#f6efe8",
  },
  card: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "24px",
    backgroundColor: "rgba(255, 252, 247, 0.9)",
    border: "1px solid rgba(95, 68, 40, 0.12)",
    boxShadow: "0 12px 34px rgba(64, 43, 24, 0.08)",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  input: {
    border: "1px solid #ccb498",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#fffdfa",
  },
  textarea: {
    border: "1px solid #ccb498",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#fffdfa",
    resize: "vertical",
    font: "inherit",
  },
  previewImage: {
    width: "100%",
    maxHeight: "280px",
    objectFit: "cover",
    borderRadius: "16px",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#2f241b",
    color: "#f6efe8",
    cursor: "pointer",
  },
  infoText: {
    margin: 0,
    color: "#574735",
  },
  error: {
    margin: "14px 0 0",
    color: "#8f2d1f",
  },
  success: {
    margin: "14px 0 0",
    color: "#2f6b3f",
  },
};
