import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpLogin } from "../../api/config";
import "./Login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(httpLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usu_usuario: usuario,
          usu_contrasenia: contrasenia,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center login-container"
      style={{ minHeight: "100vh" }}
    >
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-center">Iniciar sesión</h2>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary login-btn">
          Entrar
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
