import { forwardRef, useEffect, useState } from "react";
import {
  Alert,
  Divider,
  Select,
  Skeleton,
  Stack,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import ContenidoCompleto from "./ContenidoCompleto";
import axios from "axios";
import { ImInfo } from "react-icons/im";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { FormatUTCTime, formatearFecha } from "../../utils/fechas";
import { capitalizeWord } from "../../utils/capitalizeWord";

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
}));

export default function SelectorCitas({
  terapeutaId,
  pacienteId,
  form,
  fieldName,
  description,
  label
}) {
  const [citas, setCitas] = useState();
  const theme = useMantineTheme();

  const { classes, cx } = useStyles();
  async function fetchCitas() {
    setCitas(undefined);
    try {
      let { data: citasCargadas } = await axios.get(
        `/citas/sinNota/${terapeutaId}/${pacienteId}`
      );
      citasCargadas = citasCargadas.map((c) => ({
        value: c.id,
        label: `${formatearFecha(c.fecha)} a las ${FormatUTCTime(c.fecha)}`,
        hora: FormatUTCTime(c.fecha),
        description: c.domicilio,
        modalidad: capitalizeWord(c.modalidad),
        group: formatearFecha(c.fecha),
      }));
      setCitas(citasCargadas);
    } catch (err) {
      console.log(err);
      if (err)
        showNegativeFeedbackNotification("No hemos podido cargar tus citas 😔");
    }
  }
  useEffect(() => {
    fetchCitas();
  }, []);

  if (citas === undefined) return <Skeleton h="1em" w="38%" animate />;
  if (citas.length === 0)
    return (
      <Alert
        icon={<ImInfo size="1rem" />}
        title="¡Hola!"
        color={theme.colors["blue-calm"][4]}
      >
        Parece que actualmente todas las citas de este paciente ya cuentan con
        una nota
      </Alert>
    );

  return (
    <Select
      label={label}
      placeholder="Introduce una fecha o domicilio"
      itemComponent={Item}
      data={citas}
      description={description}
      searchable
      maxDropdownHeight={400}
      nothingFound="No hay cita"
      classNames={{ item: classes.seleccionado }}
      filter={(value, item) =>
        item.group.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
      {...form.getInputProps(fieldName)}
    />
  );
}

const Item = forwardRef(
  ({ label, modalidad, hora, description, ...others }, ref) => {
    return (
      <Stack ref={ref} {...others} spacing={2} mb="md">
        <ContenidoCompleto label="Hora" contenido={hora} />
        <ContenidoCompleto label="Modalidad" contenido={modalidad} />
        <ContenidoCompleto label="Domicilio" contenido={description} />
        {/* <Divider/> */}
      </Stack>
    );
  }
);
