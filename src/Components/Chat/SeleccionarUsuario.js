import {
  Alert,
  Group,
  Select,
  Skeleton,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useSelector } from "react-redux";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { ImInfo } from "react-icons/im";
import ImagenAvatar from "../ImagenAvatar";
import { FISIOTERAPEUTA, PACIENTE } from "../../roles";

const useStyles = createStyles((theme) => ({
  seleccionado: {
    "&[data-selected]": {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.teal[9]
            : theme.colors["green-calm"][1],
        color:
          theme.colorScheme === "dark"
            ? theme.white
            : theme.colors["blue-empire"][4],
      },
    },
  },
  dropdown: {
    zIndex: 500,
  },
}));
export default function SeleccionarUsuario({ setSeleccion, initialValue=null }) {
  const [usuarios, setUsuarios] = useState(undefined);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const usuario = useSelector(selectUsuario);
  // const [selectedValue, setSelectedValue] = useState(initialValue);
  async function fetchUsuarios() {
    try {
      if (usuario.rol === FISIOTERAPEUTA) {
        let {
          terapeuta: { id: id_terapeuta },
        } = usuario;
        let { data } = await axios.get(
          `/usuarios/fisioterapeutas/pacientes/${id_terapeuta}`
        );
        setUsuarios(
          data.map((data) => ({
            obj: {
              id: data.id_usuario,
              nombre: data.nombre,
              foto_perfil: data.foto_perfil,
              id_paciente: data.id_paciente,
            },
            value: data.id_usuario,
            k: data.id,
            label: data.nombre,
            description: "",
            image: data.foto_perfil,
          }))
        );
      }
      if (usuario.rol === PACIENTE) {
        let {
          paciente: { id: id_paciente },
        } = usuario;
        let { data } = await axios.get(
          `/usuarios/pacientes/${id_paciente}/terapeutas`
        );
        setUsuarios(
          data.map((data) => ({
            obj: {
              id: data.id_usuario,
              nombre: data.usuario.nombre,
              foto_perfil: data.usuario.foto_perfil,
            },
            value: data.id_usuario,
            k: data.id,
            label: data.usuario.nombre,
            description: "",
            image: data.usuario.foto_perfil,
            consultorio: data.nombre_del_consultorio,
          }))
        );
      }
    } catch (error) {
      console.log(error);
      if (error) {
        showNegativeFeedbackNotification(
          "Lo lamento, no hemos podido cargar a tus terapeutas"
        );
      }
    }
  }
  useEffect(() => {
    fetchUsuarios();
  }, []);
  if (usuarios === undefined) return <Skeleton w="80%" h="3em" animate />;
  if (usuarios.length === 0)
    return (
      <Alert
        icon={<ImInfo size="1rem" />}
        title="¡Hola!"
        color={theme.colors["blue-calm"][4]}
      >
        <Text>Actualmente no cuentas con contactos crear un chat</Text>
      </Alert>
    );
  return (
    <Select
      dropdownPosition="bottom"
      label="Selecciona un usuario"
      description="Puedes escribir el nombre"
      //   placeholder={terapeutas[0].label}
      // value={selectedValue}
      itemComponent={SelectItem}
      defaultValue={initialValue}
      searchable
      maxDropdownHeight={300}
      withinPortal
      classNames={{
        item: classes.seleccionado,
        itemsWrapper: classes.dropdown,
      }}
      onChange={(v) => {
        const selected = usuarios.find(({ value }) => value === v);
        if (selected) {
          setSeleccion(selected.obj);
          // setSeleccion(selected.obj.id);
        }
      }}
      nothingFound="No hay coincidencias"
      data={usuarios}
      filter={(value, item) =>
        item.label.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}

const SelectItem = forwardRef(
  ({ image, label, description, k, ...others }, ref) => (
    <div ref={ref} {...others} key={k}>
      <Group noWrap>
        <ImagenAvatar image={image} mx={0} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
