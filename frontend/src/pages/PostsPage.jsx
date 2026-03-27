import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken, getPosts } from "../services/api";

export default function PostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);

  function handleLogout() {
    clearAuthToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError("");
        setErrorDetails([]);

        // Ilk asamada sabit query ile backend baglantisini test ediyoruz.
        const response = await getPosts("page=1&limit=5");

        setPosts(response.data || []);
        setMeta(response.meta || null);
      } catch (requestError) {
        setError(requestError.message);
        setErrorDetails(requestError.details || []);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>AtarCMS</p>
          <h1 style={styles.title}>Postlar</h1>
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} type="button" onClick={handleLogout}>
            Cikis yap
          </button>
          <Link style={styles.linkButton} to="/posts/new-post">
            Yeni post
          </Link>
          <Link style={styles.linkButton} to="/posts/update-post">
            Postu duzenle
          </Link>
          <Link style={styles.linkButton} to="/posts/delete-post">
            Postu sil
          </Link>
        </div>
      </section>

      {isLoading && <p style={styles.infoText}>Postlar yukleniyor...</p>}
      {error && <p style={styles.errorText}>Hata: {error}</p>}
      {!isLoading && errorDetails.length > 0 && (
        <section style={styles.errorBox}>
          {errorDetails.map((detail, index) => (
            <p key={`${detail.field}-${index}`} style={styles.errorDetail}>
              {detail.source}.{detail.field}: {detail.message}
            </p>
          ))}
        </section>
      )}

      {!isLoading && !error && meta && (
        <section style={styles.metaBox}>
          <p style={styles.metaText}>Toplam kayit: {meta.total}</p>
          <p style={styles.metaText}>
            Sayfa: {meta.page} / {meta.totalPages || 1}
          </p>
        </section>
      )}

      <section style={styles.list}>
        {!isLoading &&
          !error &&
          posts.map((post) => (
          <article key={post.id} style={styles.card}>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                style={styles.image}
              />
            )}
            <h2 style={styles.cardTitle}>{post.title}</h2>
            <p style={styles.cardText}>Yazar: {post.author?.name || "Bilinmiyor"}</p>
            <p style={styles.cardText}>{post.content}</p>
          </article>
          ))}
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
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  linkButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    backgroundColor: "#2f241b",
    color: "#f6efe8",
  },
  secondaryButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    backgroundColor: "#d9c4a8",
    color: "#2f241b",
  },
  infoText: {
    maxWidth: "960px",
    margin: "0 auto 16px",
    color: "#574735",
  },
  errorText: {
    maxWidth: "960px",
    margin: "0 auto 16px",
    color: "#8f2d1f",
  },
  errorBox: {
    maxWidth: "960px",
    margin: "0 auto 16px",
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "#fde5df",
    border: "1px solid #efb2a1",
  },
  errorDetail: {
    margin: "0 0 8px",
    color: "#7c2416",
  },
  metaBox: {
    maxWidth: "960px",
    margin: "0 auto 20px",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  metaText: {
    margin: 0,
    color: "#574735",
  },
  list: {
    maxWidth: "960px",
    margin: "0 auto",
    display: "grid",
    gap: "16px",
  },
  card: {
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "rgba(255, 252, 247, 0.9)",
    border: "1px solid rgba(95, 68, 40, 0.12)",
    boxShadow: "0 12px 34px rgba(64, 43, 24, 0.08)",
  },
  image: {
    width: "100%",
    maxHeight: "260px",
    objectFit: "cover",
    borderRadius: "16px",
    marginBottom: "14px",
  },
  cardTitle: {
    margin: "0 0 8px",
  },
  cardText: {
    margin: 0,
    color: "#574735",
  },
};
