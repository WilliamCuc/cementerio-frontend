import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Menu from "../Menu/Menu";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Menu />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
