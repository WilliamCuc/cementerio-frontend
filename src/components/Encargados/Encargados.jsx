import "./Encargados.css";

import Alert from "react-bootstrap/Alert";
import React, { useEffect, useState } from "react";
import {
  httpGetEncargados,
  httpCrearEncargado,
  httpEditarEncargado,
  httpEliminarEncargado,
} from "../../api/config";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Encargados() {
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

  const [encargados, setEncargados] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState({
    enc_primer_nombre: "",
    enc_segundo_nombre: "",
    enc_primer_apellido: "",
    enc_segundo_apellido: "",
    enc_telefono_uno: "",
    enc_telefono_dos: "",
    enc_dpi: "",
    enc_direccion: "",
    enc_panteones: "",
  });
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const fetchEncargados = React.useCallback(
    async (currentPage = page) => {
      try {
        const offset = (currentPage - 1) * pageSize;
        const res = await fetch(
          `${httpGetEncargados}?limit=${pageSize}&offset=${offset}`
        );
        const data = await res.json();
        setEncargados(data.data);
        setTotal(data.total);
      } catch (error) {
        setAlert({
          show: true,
          message: "Error al cargar encargados" + error,
          variant: "danger",
        });
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    fetchEncargados(page);
  }, [page, pageSize, fetchEncargados]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${httpEditarEncargado}/${editId}`
      : httpCrearEncargado;
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
            ? "Encargado actualizado correctamente"
            : "Encargado creado correctamente",
          variant: "success",
        });
        setForm({
          enc_primer_nombre: "",
          enc_segundo_nombre: "",
          enc_primer_apellido: "",
          enc_segundo_apellido: "",
          enc_telefono_uno: "",
          enc_telefono_dos: "",
          enc_dpi: "",
          enc_direccion: "",
          enc_panteones: "",
        });
        setEditId(null);
        setShow(false);
        fetchEncargados(page);
      } else {
        setAlert({
          show: true,
          message: "Error al guardar el encargado",
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
        const res = await fetch(`${httpEliminarEncargado}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setAlert({
            show: true,
            message: "Encargado eliminado correctamente",
            variant: "success",
          });
          fetchEncargados(page);
        } else {
          setAlert({
            show: true,
            message: "Error al eliminar el encargado",
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

  const handleEdit = (encargado) => {
    setForm({ ...encargado });
    setEditId(encargado.enc_id);
    setShow(true);
  };

  const handleAdd = () => {
    setForm({
      enc_primer_nombre: "",
      enc_segundo_nombre: "",
      enc_primer_apellido: "",
      enc_segundo_apellido: "",
      enc_telefono_uno: "",
      enc_telefono_dos: "",
      enc_dpi: "",
      enc_direccion: "",
      enc_panteones: "",
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
      <h2>Lista de Encargados</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Agregar Encargado
      </Button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Teléfono 1</th>
            <th>Teléfono 2</th>
            <th>DPI</th>
            <th>Dirección</th>
            <th>Panteones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {encargados.map((e) => (
            <tr key={e.enc_id}>
              <td>{e.enc_primer_nombre}</td>
              <td>{e.enc_segundo_nombre}</td>
              <td>{e.enc_primer_apellido}</td>
              <td>{e.enc_segundo_apellido}</td>
              <td>{e.enc_telefono_uno}</td>
              <td>{e.enc_telefono_dos}</td>
              <td>{e.enc_dpi}</td>
              <td>{e.enc_direccion}</td>
              <td>{e.enc_panteones}</td>
              <td>
                <div className="d-flex">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(e)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(e.enc_id)}
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
            {editId ? "Editar Encargado" : "Agregar Encargado"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Primer Nombre</label>
              <input
                name="enc_primer_nombre"
                className="form-control"
                placeholder="Primer Nombre"
                value={form.enc_primer_nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Segundo Nombre</label>
              <input
                name="enc_segundo_nombre"
                className="form-control"
                placeholder="Segundo Nombre"
                value={form.enc_segundo_nombre}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Primer Apellido</label>
              <input
                name="enc_primer_apellido"
                className="form-control"
                placeholder="Primer Apellido"
                value={form.enc_primer_apellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Segundo Apellido</label>
              <input
                name="enc_segundo_apellido"
                className="form-control"
                placeholder="Segundo Apellido"
                value={form.enc_segundo_apellido}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Teléfono 1</label>
              <input
                name="enc_telefono_uno"
                className="form-control"
                placeholder="Teléfono 1"
                value={form.enc_telefono_uno}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Teléfono 2</label>
              <input
                name="enc_telefono_dos"
                className="form-control"
                placeholder="Teléfono 2"
                value={form.enc_telefono_dos}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">DPI</label>
              <input
                name="enc_dpi"
                className="form-control"
                placeholder="DPI"
                value={form.enc_dpi}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Dirección</label>
              <input
                name="enc_direccion"
                className="form-control"
                placeholder="Dirección"
                value={form.enc_direccion}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Panteones</label>
              <input
                name="enc_panteones"
                className="form-control"
                placeholder="Panteones"
                value={form.enc_panteones}
                onChange={handleChange}
                type="number"
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
