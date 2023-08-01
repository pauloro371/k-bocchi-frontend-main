import {
  Button,
  Stack,
  Skeleton,
  Text,
  Title,
  Select,
  Flex,
  Alert,
  useMantineColorScheme,
  useMantineTheme,
  Group,
  createStyles,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import axios from "axios";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { ImInfo } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import ImagenAvatar from "../ImagenAvatar";
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
export default function BotonModificarAcceso() {
  return (
    <Button variant="configuracion" onClick={mostrarTerapeutas}>
      Acceso
    </Button>
  );
}

function mostrarTerapeutas() {
  modals.open({
    title: <Title order={3}>Modificar acceso</Title>,
    children: <CuerpoModalAcceso />,
    size: "md",
    centered: false,
    withinPortal: true,
  });
}
function CuerpoModalAcceso() {
  const [seleccion, setSeleccion] = useState();
  const ref = useRef();
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/app/paciente/bitacora/modificar/acceso/${seleccion}`)
    modals.closeAll();
  }
  return (
    <>
      <Stack mah="70vh">
        <Text>
          Selecciona el terapeuta al que deseas modificar el acceso a tus notas
        </Text>
        <SeleccionarTerapeuta setSeleccion={setSeleccion} />
        <Flex justify="end">
          <Button variant="siguiente" disabled={seleccion === undefined} onClick={handleClick}>
            Modificar
          </Button>
        </Flex>
      </Stack>
    </>
  );
}

function SeleccionarTerapeuta({ setSeleccion }) {
  const [terapeutas, setTerapeutas] = useState(undefined);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const {
    paciente: { id },
  } = useSelector(selectUsuario);
  async function fecthTerapeutas() {
    try {
      let { data } = await axios.get(`/usuarios/pacientes/${id}/terapeutas`);
      setTerapeutas(
        data.map((data) => ({
          value: data.id,
          label: data.usuario.nombre,
          description: data.numero_cedula,
          image: data.usuario.foto_perfil,
          consultorio: data.nombre_del_consultorio,
        }))
      );
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
    fecthTerapeutas();
  }, []);
  if (terapeutas === undefined) return <Skeleton w="80%" h="3em" animate />;
  if (terapeutas.length === 0)
    return (
      <Alert
        icon={<ImInfo size="1rem" />}
        title="¡Hola!"
        color={theme.colors["blue-calm"][4]}
      >
        <Text>Actualmente no cuentas con un terapeuta. ¡Agenda una cita!</Text>
      </Alert>
    );
  return (
    <Select
      dropdownPosition="bottom"
      label="Selecciona un terapeuta"
      description="Puedes introducir nombre, nombre de consultorio o cedula"
      //   placeholder={terapeutas[0].label}
      itemComponent={SelectItem}
      searchable
      maxDropdownHeight={300}
      withinPortal
      classNames={{
        item: classes.seleccionado,
        itemsWrapper: classes.dropdown,
      }}
      onChange={(v) => {
        setSeleccion(v);
      }}
      nothingFound="No hay coincidencias"
      data={terapeutas}
      filter={(value, item) =>
        item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.consultorio.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}

const SelectItem = forwardRef(
  ({ image, label, description, consultorio, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <ImagenAvatar image={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
          <Text size="xs" opacity={0.65}>
            {consultorio}
          </Text>
        </div>
      </Group>
    </div>
  )
);
