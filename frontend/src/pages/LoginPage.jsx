import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const response = await login(formData);

      if (response.token) {
        // Token'i tarayicida sakliyoruz ki sonraki isteklerde kullanabilelim.
        localStorage.setItem("token", response.token);
        setSuccessMessage("Login basarili. Post sayfasina yonlendiriliyorsun.");

        // Kullanici kisa mesaji gorebilsin diye cok kisa bir bekleme koyuyoruz.
        setTimeout(() => {
          navigate("/posts");
        }, 600);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.eyebrow}>AtarCMS Admin</p>
        <h1 style={styles.title}>Giris Yap</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Sifre"
            value={formData.password}
            onChange={handleChange}
          />
          <button style={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        <Link style={styles.link} to="/register">
          Kayıt ol
        </Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "32px",
    borderRadius: "24px",
    backgroundColor: "rgba(255, 252, 247, 0.88)",
    boxShadow: "0 20px 60px rgba(64, 43, 24, 0.14)",
    border: "1px solid rgba(95, 68, 40, 0.12)",
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8b6b4a",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "36px",
  },
  text: {
    margin: "0 0 24px",
    lineHeight: 1.6,
    color: "#574735",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    border: "1px solid #ccb498",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#fffdfa",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "#2f241b",
    color: "#f6efe8",
    cursor: "pointer",
  },
  link: {
    display: "inline-block",
    marginTop: "18px",
    color: "#6f4f2d",
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
