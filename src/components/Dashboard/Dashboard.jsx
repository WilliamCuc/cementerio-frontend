import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige al login si no hay token
    }
  }, [navigate]);

  return (
    <>
      <h1>Desde Dashboard</h1>
    </>
  );
}
