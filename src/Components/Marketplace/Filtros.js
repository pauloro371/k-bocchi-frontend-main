import {
  Button,
  Center,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { currencyFormatter } from "../../utils/formatters";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CATEGORIA_DISPOSITIVO,
  CATEGORIA_MEDICAMENTO,
} from "../../utils/categorias";
import { capitalizeWord } from "../../utils/capitalizeWord";

export function Filtros({ setBusqueda }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtros, setFiltros] = useState({
    categoria: searchParams.get("categoria"),
    nuevo: searchParams.get("nuevo"),
    rango_inferior: searchParams.get("rango_inferior"),
    rango_superior: searchParams.get("rango_superior"),
  });
  const navigate = useNavigate();
  useEffect(() => {
    console.log(filtros);
  }, [filtros]);
  function updateParams() {
    let x = new URLSearchParams(searchParams);

    Object.entries(filtros).forEach(([key, value]) => {
      if (value === null) x.delete(key);
      else x.set(key, value);
    });
    navigate(`/app/marketplace/resultados?${x}`);
  }
  return (
    <Stack>
      <FiltroPrecio setFiltro={setFiltros} filtro={filtros} />
      <FiltroCategoria setFiltro={setFiltros} filtro={filtros} />
      <FiltroNuevasPublicaciones setFiltro={setFiltros} filtro={filtros} />
      <Button variant="seleccionar" onClick={updateParams}>
        Aplicar filtros
      </Button>
    </Stack>
  );
}

function BotonBorrarFiltro({ filtros, setFiltro }) {
  return (
    <Button
      compact
      variant="subtle"
      onClick={() => {
        setFiltro((f) =>
          Object.fromEntries(
            Object.entries(f).map(([key, value]) =>
              filtros.find((filtro) => filtro === key)
                ? [key, null]
                : [key, value]
            )
          )
        );
      }}
    >
      Limpiar filtros
    </Button>
  );
}
function crearRangos(step, minimo, maximo) {
  let rangos = [];
  let actual = 0;
  for (actual; actual < maximo; actual = actual + step) {
    rangos.push({
      rango_inferior: actual,
      rango_superior: actual + step,
    });
  }
  rangos.push({
    rango_inferior: actual,
    rango_superior: null,
  });
  return rangos;
}
const rangos = crearRangos(100, 0, 1000);
function FiltroPrecio({ setFiltro, filtro }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rango_inferior = searchParams.get("rango_inferior");
  const rango_superior = searchParams.get("rango_superior");
  const [value, setValue] = useState(
    rangos
      .findIndex(
        (rango) =>
          rango.rango_inferior == rango_inferior &&
          rango.rango_superior == rango_superior
      )
      .toString()
  );
  useEffect(() => {
    if (filtro.rango_inferior === null) setValue(null);
  }, [filtro]);
  useEffect(() => {
    setFiltro((f) => ({ ...f, ...rangos[value] }));
  }, [value]);

  return (
    <Paper shadow="sm" p="xl" pb="xs" pos="rel">
      <Center>Precio</Center>
      <Stack my="xs">
        <Text fz="xs" ta="center" color="dimmed">
          Mostrar productos dentro del rango de precio:
        </Text>
        <Radio.Group name="rango" value={value} onChange={setValue}>
          {rangos.map(({ rango_inferior, rango_superior }, index) =>
            rango_superior !== null ? (
              <Radio
                label={`${currencyFormatter.format(
                  rango_inferior
                )} - ${currencyFormatter.format(rango_superior)}`}
                value={`${index}`}
              />
            ) : (
              <Radio
                label={`Más de ${currencyFormatter.format(rango_inferior)}`}
                value={`${index}`}
              />
            )
          )}
        </Radio.Group>
      </Stack>
      <BotonBorrarFiltro
        setFiltro={setFiltro}
        filtros={["rango_inferior", "rango_superior"]}
      />
    </Paper>
  );
}

function FiltroCategoria({ setFiltro, filtro }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categoria, setCategoria] = useState(searchParams.get("categoria"));
  useEffect(() => {
    if (filtro.categoria === null) setCategoria(null);
  }, [filtro]);
  useEffect(() => {
    setFiltro((f) => ({ ...f, categoria }));
  }, [categoria]);
  return (
    <Paper shadow="sm" p="xl" pb="xs" pos="rel">
      <Center>Categoria</Center>
      <Stack my="xs">
        <Text fz="xs" ta="center" color="dimmed">
          Mostrar productos de la categoria:
        </Text>
        <Radio.Group name="categoria" value={categoria} onChange={setCategoria}>
          <Center>
            <Group>
              <Radio
                value={CATEGORIA_MEDICAMENTO}
                label={capitalizeWord(CATEGORIA_MEDICAMENTO)}
              />
              <Radio
                value={CATEGORIA_DISPOSITIVO}
                label={capitalizeWord(CATEGORIA_DISPOSITIVO)}
              />
            </Group>
          </Center>
        </Radio.Group>
      </Stack>
      <BotonBorrarFiltro setFiltro={setFiltro} filtros={["categoria"]} />
    </Paper>
  );
}

function FiltroNuevasPublicaciones({ setFiltro, filtro }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nuevo, setNuevo] = useState(searchParams.get("nuevo"));
  useEffect(() => {
    if (filtro.nuevo === null) setNuevo(null);
  }, [filtro]);
  useEffect(() => {
    setFiltro((f) => ({ ...f, nuevo }));
  }, [nuevo]);
  return (
    <Paper shadow="sm" p="xl" pb="xs" pos="rel">
      <Center>Mas nuevos</Center>
      <Stack my="xs">
        <Text fz="xs" ta="center" color="dimmed">
          Mostrar productos recientemente publicados
        </Text>
        <Center>
          <Radio.Group name="nuevo" value={nuevo} onChange={setNuevo}>
            <Radio value="1" label="Si" />
          </Radio.Group>
        </Center>
      </Stack>
      <BotonBorrarFiltro setFiltro={setFiltro} filtros={["nuevo"]} />
    </Paper>
  );
}

function Seccion() {
  return;
}
