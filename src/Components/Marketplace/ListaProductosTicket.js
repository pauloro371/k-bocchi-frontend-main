import { Group, Stack, Text } from "@mantine/core";
import Imagen from "../Imagen";
import { Link } from "react-router-dom";
import ImagenAvatar from "../ImagenAvatar";
import { currencyFormatter } from "../../utils/formatters";
import Vacio from "../Vacio";

export default function ListaProductosTicket({ detalles }) {
  return (
    <Stack spacing="md">
      {detalles.map(
        (
          {
            id,
            imagen,
            nombre: nombre_producto,
            cantidad,
            subtotal,
            id_paquete,
            terapeuta,
          },
          index
        ) => (
          <Group w="100%" align="center" key={`${id}${index}`}>
            <Imagen
              image={imagen}
              width="20vh"
              heightSkeleton="5em"
              widthSkeleton="5em"
            />
            <Stack style={{ flex: "1" }}>
              <div>
                <Text fw="bold">{nombre_producto}</Text>
                <Text
                  fw="lighter"
                  color="blue-calm.4"
                  underline
                  component={Link}
                  to={`/app/marketplace/envios/${id_paquete}`}
                >
                  Ver paquete
                </Text>
              </div>
              {terapeuta && (
                <div>
                  <Text>Vendedor:</Text>
                  <Group>
                    <ImagenAvatar
                      mx={0}
                      image={terapeuta.usuario.foto_perfil}
                    />
                    <Text>{terapeuta.usuario.nombre}</Text>
                  </Group>
                </div>
              )}
            </Stack>
            <Stack justify="center" align="center" spacing={0}>
              <Text fw="bold">{currencyFormatter.format(subtotal)}</Text>
              <Text fw="lighter" fs="sm" color="gray">
                Cantidad: {cantidad}
              </Text>
            </Stack>
          </Group>
        )
      )}
    </Stack>
  );
}
