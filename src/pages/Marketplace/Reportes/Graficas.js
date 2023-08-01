import { useEffect, useRef, useState } from "react";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import {
  Button,
  Flex,
  LoadingOverlay,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getMes } from "../../../utils/fechas";
import jsPDF from "jspdf";
import Vacio from "../../../Components/Vacio";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function Graficas({ mes }) {
  const [ventas, setVentas] = useState();
  const refGrafica = useRef(null);
  const {
    terapeuta: { id: id_terapeuta },
  } = useSelector(selectUsuario);
  const theme = useMantineTheme();
  async function fetchVentas() {
    try {
      let { data } = await axios.get(
        `/ventas/terapeuta/reporte/${id_terapeuta}?mes=${Number(mes) + 1}`
      );
      if (!data.ventas_anterior) {
        setVentas({ ...data });
        return;
      }
      let [ventas_actual, ventas_anterior] = igualarDatasets(
        data.ventas_actual,
        data.ventas_anterior
      );
      console.log({ ventas_actual, ventas_anterior });
      setVentas({ ventas_actual, ventas_anterior });
    } catch (error) {
      if (!error) return;
      console.log(error);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
  }
  function createDataSets() {
    let dataset = [
      {
        label: getMes(Number(mes)),
        backgroundColor: theme.colors["blue-empire"][5],
        data: ventas.ventas_actual.map(
          ({ cantidad_vendida }) => cantidad_vendida
        ),
      },
    ];
    if (ventas.ventas_anterior) {
      dataset = [
        {
          label: getMes(Number(mes - 1)),
          backgroundColor: theme.colors["green-nature"][5],
          data: ventas.ventas_anterior.map(
            ({ cantidad_vendida }) => cantidad_vendida
          ),
        },
        ...dataset,
      ];
    }
    return dataset;
  }
  async function handleDownload() {
    let chart = refGrafica.current;
    // Crea un nuevo elemento canvas
    const canvasClon = document.createElement("canvas");
    // Copia el ancho y alto del canvas original al clon
    // Obtén el contexto 2D del canvas original y el clon
    const newWidth = 2000;
    const aspectRatio = canvasClon.width / canvasClon.height;
    const newHeight = newWidth / aspectRatio;
    canvasClon.width = newWidth;
    canvasClon.height = newHeight;
    const contextClon = canvasClon.getContext("2d");
    contextClon.drawImage(chart.canvas, 0, 0, newWidth, newHeight);
    // Copia el contenido del canvas original al clon
    var pdf = new jsPDF({
      orientation: "l",
      unit: "px",
      format: [newWidth, newHeight],
      hotfixes: ["px_scaling"],
      compress: false,
    });
    pdf.addImage(canvasClon, "PNG", 0, 0);

    // download the pdf
    pdf.save(`Reporte_Ventas_${getMes(mes)}`);
    console.log(chart.canvas);
  }
  useEffect(() => {
    setVentas();
    fetchVentas();
  }, [mes]);
  if (ventas === undefined) return <LoadingOverlay overlayBlur={3} visible />;
  if (ventas.ventas_actual.length === 0)
    return <Vacio children={<Text>No hay ventas</Text>} />;
  return (
    <>
      <Flex justify="end">
        <Button onClick={handleDownload}>Descargar</Button>
      </Flex>
      <Bar
        ref={refGrafica}
        options={{
          responsive: true,
          resizeDelay: 100,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `Ventas de ${getMes(mes - 1)} con respecto a ${getMes(
                mes
              )}`,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Producto",
              },
            },
            y: {
              title: {
                display: true,
                text: "Cantidad",
              },
              min: 0,
              ticks: {
                // forces step size to be 50 units
                stepSize: 1,
              },
            },
          },
        }}
        data={{
          labels: ventas.ventas_actual.map(({ nombre }) => nombre),
          datasets: createDataSets(),
        }}
      />
    </>
  );
}

function igualarDatasets(ventas, ventas_anterior) {
  let total = ventas.length + ventas_anterior.length;
  let inserciones = 0;
  let i = 0; // iterador para ventas
  let y = 0; //iterador para ventas_anterior
  let ventas_final = []; //el resultado final de ventas
  let ventas_anterior_final = []; //el resultado final de vnetas_anterior
  while (y < ventas_anterior.length && i < ventas.length) {
    inserciones++;
    if (ventas[i].cantidad_vendida > ventas_anterior[y].cantidad_vendida) {
      //aumentamos i
      //insertamos en venta_final el item mayor
      ventas_final.push({
        ...ventas[i],
      });
      //luego buscamos si hay un elemento con ese valor en ventas_anterior
      let index = ventas_anterior.findIndex(
        (value) => value.id_producto === ventas[i].id_producto
      );
      //Si existe, lo agregamos a ventas_anterior_final
      if (index > -1) {
        //eliminar item de ventas_anterior
        ventas_anterior_final.push({
          ...ventas_anterior[index],
        });
        ventas_anterior.splice(index, 1);
      } else {
        //Si no existe insertamos el item mayor pero sin cantidad vendida
        ventas_anterior_final.push({
          ...ventas[i],
          cantidad_vendida: 0,
        });
      }
      i++;
    } else {
      //Aumentamos y
      //Insertamos en venta_anterior_final el item mayor
      ventas_anterior_final.push({
        ...ventas_anterior[y],
      });
      //Buscamos si existe un item con esa id en ventas
      let index = ventas.findIndex(
        (value) => value.id_producto === ventas_anterior[y].id_producto
      );
      //Si existe entonces lo eliminamos de ventas y lo insertamos hasta arriba en ventas_final
      if (index > -1) {
        //eliminar item de ventas
        ventas_final.push({
          ...ventas[index],
        });
        ventas.splice(index, 1);
      } else {
        //Si no existe lo agregamos a ventas el item mayor
        ventas_final.push({
          ...ventas_anterior[y],
          cantidad_vendida: 0,
        });
      }
      y++;
    }
  }

  while (y < ventas_anterior.length) {
    ventas_anterior_final.push(ventas_anterior[y]);
    // ventas_final.push(ventas_anterior[y]);
    y++;
  }

  while (i < ventas.length) {
    // ventas_anterior_final.push(ventas[i]);
    ventas_final.push(ventas[i]);
    i++;
  }

  // {
  //     "ventas_anterior": [
  //         {
  //             "id_producto": 33,
  //             "nombre": "Producto pruebaaa",
  //             "id_ticket": 21,
  //             "cantidad_vendida": 1
  //         }
  //     ],
  //     "ventas_actual": [
  //         {
  //             "id_producto": 20,
  //             "nombre": "Otro",
  //             "id_ticket": 24,
  //             "cantidad_vendida": 5
  //         },
  //         {
  //             "id_producto": 21,
  //             "nombre": "prueba ",
  //             "id_ticket": 24,
  //             "cantidad_vendida": 3
  //         },
  //         {
  //             "id_producto": 23,
  //             "nombre": "Pelota de ejercicio",
  //             "id_ticket": 24,
  //             "cantidad_vendida": 1
  //         }
  //     ]
  // }

  return [ventas_final, ventas_anterior_final];
}
