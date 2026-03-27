import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPost } from "../services/api";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

      const createdPost = await createPost(formData);

      if (createdPost.id) {
        setSuccessMessage("Post basariyla olusturuldu.");

        setTimeout(() => {
          navigate("/posts");
        }, 700);
      }
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
          <h1 style={styles.title}>Yeni Post</h1>
        </div>

        <Link style={styles.linkButton} to="/posts">
          Listeye don
        </Link>
      </section>

      <section style={styles.card}>
        <form style={styles.form} onSubmit={handleSubmit}>
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

          <button style={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Post Olustur"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
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
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#2f241b",
    color: "#f6efe8",
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
