import { Badge } from "@mantine/core";
import {
  ESTADO_CAMINO,
  ESTADO_ENTREGADO,
  ESTADO_PAQUETERIA,
  ESTADO_PREPARADO,
  ESTADO_PUNTO,
  ESTADO_SIN_MANDAR,
} from "../../../utils/paquetesEstados";
import BadgeCamino from "./BadgeCamino";
import BadgeEntregado from "./BadgeEntregado";
import BadgePaqueteria from "./BadgePaqueteria";
import BadgePreparado from "./BadgePreparado";
import BadgePunto from "./BadgePunto";
import BadgeSinMandar from "./BadgeSinMandar";

export default function BadgeEstadoPaquete({ estado }) {
  switch (estado) {
    case ESTADO_SIN_MANDAR:
      return <BadgeSinMandar />;
    case ESTADO_PAQUETERIA:
      return <BadgePaqueteria />;
    case ESTADO_PREPARADO:
      return <BadgePreparado />;
    case ESTADO_CAMINO:
      return <BadgeCamino />;
    case ESTADO_PUNTO:
      return <BadgePunto />;
    case ESTADO_ENTREGADO:
      return <BadgeEntregado />;
    default:
      return <Badge>?</Badge>;
  }
}
