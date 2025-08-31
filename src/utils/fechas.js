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
