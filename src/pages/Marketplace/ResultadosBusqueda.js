import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import CardProducto from "../../Components/Marketplace/CardProducto";
import { useSm } from "../../utils/mediaQueryHooks";
import { Flex, LoadingOverlay, Text } from "@mantine/core";
import Vacio from "../../Components/Vacio";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";

const mockData = {
  id: 29,
  nombre: "MarihuanolMarihuanolMarihuanolMarihuanolMarihuanolMarihuanol",
  caracteristicas:
    "Es un producto de uso tópico que se comercializa como un ungüento o pomada. Se promociona como un remedio para aliviar el dolor muscular y articular, así como para tratar afecciones como artritis, reumatismo, torceduras y contusiones",
  precio: 234,
  stock: 2,
  imagen: "productos/e09508017f5d3b1ad4d558a466763321.jpg",
  categoria: "medicamento",
  id_terapeuta: 218,
  fecha_publicacion: "2023-07-06T21:25:51.000Z",
  cantidad_vendida: 0,
  isNuevo: 1,
  hasStock: 1,
  terapeuta: {
    id: 218,
    id_usuario: "9667035f-3ab1-470c-97a1-a5a596acd11fmock",
    numero_cedula: "1419132",
    usuario: {
      id: "9667035f-3ab1-470c-97a1-a5a596acd11fmock",
      nombre: "Marcelo Mena Arnau",
      foto_perfil: "9667035f-3ab1-470c-97a1-a5a596acd11fmock.jpeg",
    },
  },
};
function serializarSearchParams(object) {
  const filteredEntries = Object.entries(object).filter(
    ([key, value]) => value !== undefined
  );
  let object_filtered = Object.fromEntries(filteredEntries);
  return new URLSearchParams(object_filtered);
}
export default function ResultadosBusqueda() {
  let [searchParams, setSearchParams] = useSearchParams();
  let sm = useSm();
  const [productos, setProductos] = useState();
  const [buscando, setBuscando] = useState(true);
  async function fetchProductos() {
    setBuscando(true);
    try {
      let { data } = await axios.get(`/productos?${searchParams}`);
      setProductos(data);
    } catch (err) {
      if (err) {
        let {
          response: { data },
        } = err;
        showNegativeFeedbackNotification(data);
      }
      console.log(err);
      return;
    }
    setBuscando(false);
  }
  useEffect(() => {
    fetchProductos();
  }, [searchParams]);
  if (buscando) return <LoadingOverlay visible overlayBlur={2} />;

  if (productos.length === 0)
    return <Vacio children={<Text>No hay productos</Text>} />;
  return (
    <Flex
      maw="100vw"
      justify={!sm ? "center" : "start"}
      px="sm"
      wrap="wrap"
      gap="md"
    >
      {productos.map((producto) => (
        <CardProducto
          key={producto.id}
          {...producto}
          imagen_vendedor={producto.terapeuta.usuario.foto_perfil}
          nombre_vendedor={producto.terapeuta.usuario.nombre}
        />
      ))}
    </Flex>
  );
}
