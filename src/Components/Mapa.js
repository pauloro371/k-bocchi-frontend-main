import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import "../css/mapa.css";

import {
  Box,
  Button,
  Flex,
  Grid,
  Loader,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { notifications } from "@mantine/notifications";
import { showPositiveFeedbackNotification } from "../utils/notificationTemplate";
const libraries = ["places"];
//Este componente permite cargar el mapa
//Recibe setDatosLat que es un setter que pasa los datos obtenidos de la api de google places
export default function MapaComponent({ setDatosLat,bottom }) {
  //Primero se carga el script de google maps, con la key de la aplicación y se le indica que librerías cargar (places)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
  });
  //Si aún no carga, se muestra un overlay de carga
  if (!isLoaded) return <LoadingOverlay visible />;
  //Una vez carga se muestra el componente del mapa
  return <MapaSelectPlace setDatosLat={setDatosLat} />;
}


//Este componente es el mapa en sí
function MapaSelectPlace({ setDatosLat }) {
  //se define el centro del mapa, en este caso se centra en cdmx
  const center = useMemo(() => ({ lat: 19.43, lng: -99.13 }));

  //Se crea el estado que va a almacenar la direccion y coordenadas obtenidas
  const [selected, setSelected] = useState({
    direccion: null,
    coords: null,
  });
  return (
    <>
    {/* Componente de la api de google places, permite agregar un buscador de lugares, se le pasa setSelected para guardar la seleccion */}
      <PlacesAutocomplete style={{ width: "90%" }} setSelected={setSelected} />

{/* Se renderiza el mapa */}
      <GoogleMap
        zoom={15}
        center={selected.coords || center}
        mapContainerClassName="googleMapa"
      >
        {/* Se renderiza el cursor */}
        {selected.coords && <MarkerF position={selected.coords} />}
      </GoogleMap>
      {/* Se carga el boton de seleccion */}
      <Button
        color="green-nature"
        disabled={!selected}
        onClick={() => {
          //Se manda a llamar el setter con los datos obtenidos de la seleccion
          let returned = setDatosLat(selected);
          //Se muestra un mensaje de confirmación
          showPositiveFeedbackNotification(
            "Se ha guardado la ubicación seleccionada"
          );
          if (returned === true) return;
          modals.closeAll();
        }}
      >
        Seleccionar
      </Button>
    </>
  );
}

function PlacesAutocomplete({ setSelected }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "mx",
      },
      language: "es-419",
      types: ["address"],
    },
    debounce: 6000,
  });
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  useEffect(() => {
    if (status === "OK")
      setOptions(data.map(({ place_id, description }) => description));
    console.log(data);
  }, [status]);
  useEffect(() => {
    if (selectedValue !== "") fetchCoords();
  }, [selectedValue]);

  async function fetchCoords() {
    setValue(selectedValue, false);
    clearSuggestions();
    const results = await getGeocode({
      address: selectedValue,
    });
    const { lat, lng } = await getLatLng(results[0]);
    console.log({ lat, lng });
    setSelected({ direccion: selectedValue, coords: { lat, lng } });
  }
  return (
    <Select
      label="Ubicacion"
      placeholder="Busca una dirección..."
      searchable
      onChange={setSelectedValue}
      nothingFound="No hay resultados"
      disabled={!ready}
      searchValue={value}
      onSearchChange={(e) => {
        setValue(e);
        console.log(e);
      }}
      data={options}
    />
  );
}
export const abrirMapa = ({ setDatosLat }) => {
  //Esta función recibe un setter, que se va a ejecutar con los datos obtenidos de la api de places de google map
  modals.open({
    id: "mapa-modal",
    title: <Title order={3}>Añadir ubicación</Title>,
    fullScreen: true,
    children: (
      <SimpleGrid cols={1}>
        <MapaComponent setDatosLat={setDatosLat} />
      </SimpleGrid>
    ),
  });
};
