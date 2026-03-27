import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deletePost, getCurrentUserId, getPosts } from "../services/api";

export default function DeletePostPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadMyPosts() {
      try {
        setIsLoading(true);
        setError("");

        const currentUserId = getCurrentUserId();

        if (!currentUserId) {
          setError("Post silmek icin once giris yapman gerekiyor.");
          return;
        }

        const response = await getPosts(
          `authorId=${currentUserId}&page=1&limit=20`,
        );
        setPosts(response.data || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadMyPosts();
  }, []);

  async function handleDelete(postId) {
    try {
      setDeletingPostId(postId);
      setError("");
      setSuccessMessage("");

      await deletePost(postId);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setSuccessMessage("Post basariyla silindi.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingPostId(null);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>AtarCMS</p>
          <h1 style={styles.title}>Post Sil</h1>
        </div>

        <Link style={styles.linkButton} to="/posts">
          Listeye don
        </Link>
      </section>

      <section style={styles.card}>
        <p style={styles.infoText}>
          Burada sadece giris yapan yazarin postlari listelenir. Silmek
          istedigin postun kartindaki butonu kullan.
        </p>

        {isLoading && <p style={styles.infoText}>Postlar yukleniyor...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p style={styles.infoText}>
            Sana ait silinebilecek bir post bulunamadi.
          </p>
        )}

        <div style={styles.list}>
          {posts.map((post) => (
            <article key={post.id} style={styles.postCard}>
              <div>
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p style={styles.postText}>{post.content}</p>
              </div>

              <button
                style={styles.button}
                type="button"
                disabled={deletingPostId === post.id}
                onClick={() => handleDelete(post.id)}
              >
                {deletingPostId === post.id ? "Siliniyor..." : "Bu postu sil"}
              </button>
            </article>
          ))}
        </div>

        <button
          style={styles.secondaryButton}
          type="button"
          onClick={() => navigate("/posts")}
        >
          Postlara git
        </button>
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
  infoText: {
    margin: "0 0 18px",
    color: "#574735",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  postCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: "16px",
    padding: "18px",
    borderRadius: "18px",
    backgroundColor: "#fffdfa",
    border: "1px solid rgba(95, 68, 40, 0.12)",
  },
  postTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
  },
  postText: {
    margin: 0,
    color: "#574735",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#8f2d1f",
    color: "#f6efe8",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "none",
    marginTop: "18px",
    padding: "12px 16px",
    borderRadius: "14px",
    backgroundColor: "#d9c4a8",
    color: "#2f241b",
    cursor: "pointer",
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
