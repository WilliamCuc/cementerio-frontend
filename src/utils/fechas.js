export function formatFecha(fecha) {
  if (!fecha) return "";
  if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) {
    fecha = fecha.slice(0, 10);
  }
  const partes = fecha.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) return fecha;
  return fecha;
}

export function toInputDate(fecha) {
  if (!fecha) return "";
  if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) {
    return fecha.slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const partesSlash = fecha.split("/");
  if (partesSlash.length === 3) {
    return `${partesSlash[2]}-${partesSlash[1]}-${partesSlash[0]}`;
  }
  const partesGuion = fecha.split("-");
  if (partesGuion.length === 3) {
    return `${partesGuion[2]}-${partesGuion[1]}-${partesGuion[0]}`;
  }
  return "";
}
