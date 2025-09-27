import "./Panteones.css";
import Alert from "react-bootstrap/Alert";
import React, { useEffect, useState } from "react";
import {
  httpGetPanteones,
  httpCrearPanteon,
  httpEditarPanteon,
  httpEliminarPanteon,
  httpGetTodasLocaciones,
} from "../../api/config";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Panteones() {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const [panteones, setPanteones] = useState([]);
  const [locaciones, setLocaciones] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState({
    pan_no_panteon: "",
    pan_locacion_id: "",
    pan_capacidad_maxima: 6,
    pan_descripcion: "",
  });
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const fetchLocaciones = async () => {
    try {
      const res = await fetch(httpGetTodasLocaciones);
      const data = await res.json();
      setLocaciones(data);
    } catch (error) {
      console.error("Error al cargar locaciones:", error);
    }
  };

  const fetchPanteones = React.useCallback(
    async (currentPage = page) => {
      try {
        const offset = (currentPage - 1) * pageSize;
        const res = await fetch(
          `${httpGetPanteones}?limit=${pageSize}&offset=${offset}`
        );
        const data = await res.json();
        setPanteones(data.data);
        setTotal(data.total);
      } catch (error) {
        setAlert({
          show: true,
          message: "Error al cargar panteones: " + error,
          variant: "danger",
        });
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    fetchLocaciones();
  }, []);

  useEffect(() => {
    fetchPanteones(page);
  }, [page, pageSize, fetchPanteones]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${httpEditarPanteon}/${editId}` : httpCrearPanteon;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setAlert({
          show: true,
          message: editId
            ? "Panteón actualizado correctamente"
            : "Panteón creado correctamente",
          variant: "success",
        });
        setForm({
          pan_no_panteon: "",
          pan_locacion_id: "",
          pan_capacidad_maxima: 6,
          pan_descripcion: "",
        });
        setEditId(null);
        setShow(false);
        fetchPanteones(page);
      } else {
        setAlert({
          show: true,
          message: "Error al guardar el panteón",
          variant: "danger",
        });
      }
    } catch {
      setAlert({
        show: true,
        message: "Error de conexión al guardar",
        variant: "danger",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      try {
        const res = await fetch(`${httpEliminarPanteon}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setAlert({
            show: true,
            message: "Panteón eliminado correctamente",
            variant: "success",
          });
          fetchPanteones(page);
        } else {
          setAlert({
            show: true,
            message: "Error al eliminar el panteón",
            variant: "danger",
          });
        }
      } catch {
        setAlert({
          show: true,
          message: "Error de conexión al eliminar",
          variant: "danger",
        });
      }
    }
  };

  const handleEdit = (panteon) => {
    setForm({ ...panteon });
    setEditId(panteon.pan_id);
    setShow(true);
  };

  const handleAdd = () => {
    setForm({
      pan_no_panteon: "",
      pan_locacion_id: "",
      pan_capacidad_maxima: 6,
      pan_descripcion: "",
    });
    setEditId(null);
    setShow(true);
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <h2>Gestión de Panteones</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Agregar Panteón
      </Button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>No. Panteón</th>
            <th>Locación</th>
            <th>Capacidad Máxima</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {panteones.map((p) => (
            <tr key={p.pan_id}>
              <td>{p.pan_no_panteon}</td>
              <td>{p.loc_area || "Sin locación"}</td>
              <td>{p.pan_capacidad_maxima}</td>
              <td>{p.pan_descripcion}</td>
              <td>
                <div className="d-flex">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(p)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p.pan_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <span>Página: </span>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="me-2"
          >
            Anterior
          </Button>
          <span>{page}</span>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
            className="ms-2"
          >
            Siguiente
          </Button>
        </div>
        <div>
          <span>Mostrar: </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="form-select form-select-sm d-inline-block w-auto"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <span>Total: {total}</span>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Editar Panteón" : "Agregar Panteón"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">No. Panteón *</label>
              <input
                name="pan_no_panteon"
                className="form-control"
                placeholder="No. Panteón"
                value={form.pan_no_panteon}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Capacidad Máxima</label>
              <input
                name="pan_capacidad_maxima"
                className="form-control"
                placeholder="Capacidad Máxima"
                type="number"
                value={form.pan_capacidad_maxima}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Locación</label>
              <select
                name="pan_locacion_id"
                className="form-select"
                value={form.pan_locacion_id}
                onChange={handleChange}
              >
                <option value="">Seleccione una locación</option>
                {locaciones.map((loc) => (
                  <option key={loc.loc_id} value={loc.loc_id}>
                    {loc.loc_area}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12">
              <label className="form-label">Descripción</label>
              <textarea
                name="pan_descripcion"
                className="form-control"
                placeholder="Descripción"
                value={form.pan_descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="col-12">
              <Button type="submit" variant="success">
                {editId ? "Actualizar" : "Agregar"}
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShow(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
