import "./Transacciones.css";
import Alert from "react-bootstrap/Alert";
import React, { useEffect, useState } from "react";
import {
  httpGetTransacciones,
  httpCrearTransaccion,
  httpEliminarTransaccion,
  httpGetEspacios,
  httpGetResumenPagosEspacio,
} from "../../api/config";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { formatFecha } from "../../utils/fechas";

export default function Transacciones() {
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

  const [transacciones, setTransacciones] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState({
    tra_fecha_pago: new Date().toISOString().split("T")[0],
    tra_abono: "",
    tra_documento: "",
    tra_espacios: "",
    tra_observaciones: "",
  });
  const [show, setShow] = useState(false);
  const [showResumen, setShowResumen] = useState(false);
  const [resumenPagos, setResumenPagos] = useState(null);

  const fetchEspacios = async () => {
    try {
      const res = await fetch(`${httpGetEspacios}?limit=1000&offset=0`);
      const data = await res.json();
      setEspacios(data.data);
    } catch (error) {
      console.error("Error al cargar espacios:", error);
    }
  };

  const fetchTransacciones = React.useCallback(
    async (currentPage = page) => {
      try {
        const offset = (currentPage - 1) * pageSize;
        const res = await fetch(
          `${httpGetTransacciones}?limit=${pageSize}&offset=${offset}`
        );
        const data = await res.json();
        setTransacciones(data.data);
        setTotal(data.total);
      } catch (error) {
        setAlert({
          show: true,
          message: "Error al cargar transacciones: " + error,
          variant: "danger",
        });
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    fetchEspacios();
  }, []);

  useEffect(() => {
    fetchTransacciones(page);
  }, [page, pageSize, fetchTransacciones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "tra_espacios" && value) {
      const espacio = espacios.find((e) => e.esp_id === parseInt(value));
      setEspacioSeleccionado(espacio);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (espacioSeleccionado) {
      const restante = Number(espacioSeleccionado.esp_restante_pago);
      const abono = Number(form.tra_abono);
      if (abono > restante) {
        setAlert({
          show: true,
          message: `El abono no puede ser mayor al saldo restante (Q${restante.toFixed(2)})`,
          variant: "warning",
        });
        return;
      }
    }

    try {
      const res = await fetch(httpCrearTransaccion, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        const data = await res.json();
        setAlert({
          show: true,
          message: `Transacción registrada correctamente. Nuevo saldo: Q${data.espacioActualizado.esp_restante_pago}`,
          variant: "success",
        });
        setForm({
          tra_fecha_pago: new Date().toISOString().split("T")[0],
          tra_abono: "",
          tra_documento: "",
          tra_espacios: "",
          tra_observaciones: "",
        });
        setEspacioSeleccionado(null);
        setShow(false);
        fetchTransacciones(page);
        fetchEspacios();
      } else {
        setAlert({
          show: true,
          message: "Error al guardar la transacción",
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
    if (
      window.confirm(
        "⚠️ ADVERTENCIA: Eliminar esta transacción NO revertirá los pagos registrados. ¿Estás seguro?"
      )
    ) {
      try {
        const res = await fetch(`${httpEliminarTransaccion}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setAlert({
            show: true,
            message: "Transacción eliminada (los pagos NO se revirtieron)",
            variant: "warning",
          });
          fetchTransacciones(page);
        } else {
          setAlert({
            show: true,
            message: "Error al eliminar la transacción",
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

  const handleVerResumen = async (espacioId) => {
    try {
      const res = await fetch(`${httpGetResumenPagosEspacio}/${espacioId}`);
      const data = await res.json();
      setResumenPagos(data);
      setShowResumen(true);
    } catch (error) {
      setAlert({
        show: true,
        message: "Error al cargar resumen: " + error,
        variant: "danger",
      });
    }
  };

  const handleAdd = () => {
    setForm({
      tra_fecha_pago: new Date().toISOString().split("T")[0],
      tra_abono: "",
      tra_documento: "",
      tra_espacios: "",
      tra_observaciones: "",
    });
    setEspacioSeleccionado(null);
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
      <h2>Gestión de Transacciones</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Registrar Pago
      </Button>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Espacio</th>
              <th>Tipo</th>
              <th>Locación</th>
              <th>Abono</th>
              <th>Documento</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((tra) => (
              <tr key={tra.tra_id}>
                <td>{formatFecha(tra.tra_fecha_pago)}</td>
                <td>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleVerResumen(tra.tra_espacios)}
                  >
                    {tra.esp_no_espacio}
                  </Button>
                </td>
                <td>
                  <span
                    className={`badge ${
                      tra.esp_espacio === "NICHO" ? "bg-primary" : "bg-success"
                    }`}
                  >
                    {tra.esp_espacio}
                  </span>
                </td>
                <td>{tra.loc_area}</td>
                <td className="text-end">
                  <strong>Q{Number(tra.tra_abono).toFixed(2)}</strong>
                </td>
                <td>{tra.tra_documento || "N/A"}</td>
                <td>{tra.tra_observaciones || "-"}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(tra.tra_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          <Modal.Title>Registrar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Fecha de Pago *</label>
              <input
                name="tra_fecha_pago"
                className="form-control"
                type="date"
                value={form.tra_fecha_pago}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Documento</label>
              <input
                name="tra_documento"
                className="form-control"
                placeholder="No. de recibo, factura, etc."
                value={form.tra_documento}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Espacio *</label>
              <select
                name="tra_espacios"
                className="form-select"
                value={form.tra_espacios}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un espacio</option>
                {espacios.map((esp) => (
                  <option key={esp.esp_id} value={esp.esp_id}>
                    {esp.esp_no_espacio} - {esp.esp_espacio} ({esp.loc_area}) -
                    Restante: Q{Number(esp.esp_restante_pago).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            {espacioSeleccionado && (
              <div className="col-md-12">
                <div className="alert alert-info">
                  <strong>Información del Espacio:</strong>
                  <ul className="mb-0 mt-2">
                    <li>
                      Valor Total: Q
                      {Number(espacioSeleccionado.esp_valor_total).toFixed(2)}
                    </li>
                    <li>
                      Total Pagado: Q
                      {Number(espacioSeleccionado.esp_total_pagado).toFixed(2)}
                    </li>
                    <li>
                      <strong>
                        Saldo Restante: Q
                        {Number(espacioSeleccionado.esp_restante_pago).toFixed(
                          2
                        )}
                      </strong>
                    </li>
                    <li>
                      Cuotas: {espacioSeleccionado.esp_cuotas_restantes}/
                      {espacioSeleccionado.esp_cuotas}
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <div className="col-md-6">
              <label className="form-label">Abono *</label>
              <input
                name="tra_abono"
                className="form-control"
                placeholder="Monto a pagar"
                type="number"
                step="0.01"
                min="0.01"
                value={form.tra_abono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Observaciones</label>
              <textarea
                name="tra_observaciones"
                className="form-control"
                placeholder="Notas adicionales"
                value={form.tra_observaciones}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="col-12">
              <Button type="submit" variant="success">
                Registrar Pago
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

      <Modal show={showResumen} onHide={() => setShowResumen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Resumen de Pagos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resumenPagos && (
            <div>
              <h5>Espacio: {resumenPagos.esp_no_espacio}</h5>
              <div className="row mt-3">
                <div className="col-md-6">
                  <p>
                    <strong>Valor Total:</strong> Q
                    {Number(resumenPagos.esp_valor_total).toFixed(2)}
                  </p>
                  <p>
                    <strong>Total Pagado:</strong> Q
                    {Number(resumenPagos.esp_total_pagado).toFixed(2)}
                  </p>
                  <p>
                    <strong>Saldo Restante:</strong> Q
                    {Number(resumenPagos.esp_restante_pago).toFixed(2)}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Cuotas Restantes:</strong>{" "}
                    {resumenPagos.esp_cuotas_restantes}/{resumenPagos.esp_cuotas}
                  </p>
                  <p>
                    <strong>Total Transacciones:</strong>{" "}
                    {resumenPagos.total_transacciones}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`badge ${
                        resumenPagos.esp_ocupado ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {resumenPagos.esp_ocupado ? "Ocupado" : "Disponible"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResumen(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}