export default function CarritoItem({ carritoItem }) {
  let { producto } = carritoItem;
  return <div>{producto.nombre}</div>;
}
