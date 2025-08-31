// Formatea fecha yyyy-mm-dd o ISO a dd/mm/yyyy
function formatFecha(fecha) {
  if (!fecha) return "";
  // Si es formato ISO, extrae yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) {
    fecha = fecha.slice(0, 10);
  }
  // Si está en formato yyyy-mm-dd
  const partes = fecha.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  // Si está en formato dd/mm/yyyy, lo dejamos igual
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) return fecha;
  return fecha;
}
import Alert from "react-bootstrap/Alert";
import { toInputDate } from "../../utils/fechas";
import React, { useEffect, useState } from "react";
import {
  httpGetDifuntos,
  httpCrearDifunto,
  httpEditarDifunto,
  httpEliminarDifunto,
} from "../../api/config";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Difuntos() {
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

  const [difuntos, setDifuntos] = useState([]);
  const [form, setForm] = useState({
    dif_primer_nombre: "",
    dif_segundo_nombre: "",
    dif_primer_apellido: "",
    dif_segundo_apellido: "",
    dif_dpi: "",
    dif_espacios: "",
    dif_fecha_defuncion: "",
    dif_fecha_entierro: "",
  });
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const fetchDifuntos = async () => {
    try {
      const res = await fetch(httpGetDifuntos);
      const data = await res.json();
      setDifuntos(data);
    } catch {
      setAlert({
        show: true,
        message: "Error al cargar difuntos",
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    fetchDifuntos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${httpEditarDifunto}/${editId}` : httpCrearDifunto;
    const method = editId ? "PUT" : "POST";
    // Enviamos las fechas tal cual están en el input
    const formToSend = {
      ...form,
      dif_fecha_defuncion: form.dif_fecha_defuncion,
      dif_fecha_entierro: form.dif_fecha_entierro,
    };
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToSend),
      });
      if (res.ok) {
        setAlert({
          show: true,
          message: editId
            ? "Difunto actualizado correctamente"
            : "Difunto creado correctamente",
          variant: "success",
        });
        setForm({
          dif_primer_nombre: "",
          dif_segundo_nombre: "",
          dif_primer_apellido: "",
          dif_segundo_apellido: "",
          dif_dpi: "",
          dif_espacios: "",
          dif_fecha_defuncion: "",
          dif_fecha_entierro: "",
        });
        setEditId(null);
        setShow(false);
        fetchDifuntos();
      } else {
        setAlert({
          show: true,
          message: "Error al guardar el difunto",
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
        const res = await fetch(`${httpEliminarDifunto}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setAlert({
            show: true,
            message: "Difunto eliminado correctamente",
            variant: "success",
          });
          fetchDifuntos();
        } else {
          setAlert({
            show: true,
            message: "Error al eliminar el difunto",
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

  const handleEdit = (difunto) => {
    setForm({
      ...difunto,
      dif_fecha_defuncion: toInputDate(difunto.dif_fecha_defuncion),
      dif_fecha_entierro: toInputDate(difunto.dif_fecha_entierro),
    });
    setEditId(difunto.dif_id);
    setShow(true);
  };

  const handleAdd = () => {
    setForm({
      dif_primer_nombre: "",
      dif_segundo_nombre: "",
      dif_primer_apellido: "",
      dif_segundo_apellido: "",
      dif_dpi: "",
      dif_espacios: "",
      dif_fecha_defuncion: "",
      dif_fecha_entierro: "",
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
      <h2>Lista de Difuntos</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Agregar Difunto
      </Button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>DPI</th>
            <th>Espacios</th>
            <th>Fecha Defunción</th>
            <th>Fecha Entierro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {difuntos.map((d) => (
            <tr key={d.dif_id}>
              <td>{d.dif_primer_nombre}</td>
              <td>{d.dif_segundo_nombre}</td>
              <td>{d.dif_primer_apellido}</td>
              <td>{d.dif_segundo_apellido}</td>
              <td>{d.dif_dpi}</td>
              <td>{d.dif_espacios}</td>
              <td>{formatFecha(d.dif_fecha_defuncion)}</td>
              <td>{formatFecha(d.dif_fecha_entierro)}</td>
              <td>
                <div className="d-flex">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(d)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(d.dif_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Editar Difunto" : "Agregar Difunto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Primer Nombre</label>
              <input
                name="dif_primer_nombre"
                className="form-control"
                placeholder="Primer Nombre"
                value={form.dif_primer_nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Segundo Nombre</label>
              <input
                name="dif_segundo_nombre"
                className="form-control"
                placeholder="Segundo Nombre"
                value={form.dif_segundo_nombre}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Primer Apellido</label>
              <input
                name="dif_primer_apellido"
                className="form-control"
                placeholder="Primer Apellido"
                value={form.dif_primer_apellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Segundo Apellido</label>
              <input
                name="dif_segundo_apellido"
                className="form-control"
                placeholder="Segundo Apellido"
                value={form.dif_segundo_apellido}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">DPI</label>
              <input
                name="dif_dpi"
                className="form-control"
                placeholder="DPI"
                value={form.dif_dpi}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Espacios</label>
              <input
                name="dif_espacios"
                className="form-control"
                placeholder="Espacios"
                value={form.dif_espacios}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha Defunción</label>
              <input
                name="dif_fecha_defuncion"
                className="form-control"
                placeholder="Fecha Defunción"
                value={form.dif_fecha_defuncion}
                onChange={handleChange}
                type="date"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha Entierro</label>
              <input
                name="dif_fecha_entierro"
                className="form-control"
                placeholder="Fecha Entierro"
                value={form.dif_fecha_entierro}
                onChange={handleChange}
                type="date"
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
