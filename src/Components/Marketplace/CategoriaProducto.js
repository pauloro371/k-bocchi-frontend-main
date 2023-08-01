import { Badge } from "@mantine/core";
import { CATEGORIA_DISPOSITIVO, CATEGORIA_MEDICAMENTO } from "../../utils/categorias";
import { capitalizeWord } from "../../utils/capitalizeWord";

export default function CategoriaProducto({categoria}){
    if(categoria===CATEGORIA_DISPOSITIVO)
        return <Badge variant="medicamento">{capitalizeWord(CATEGORIA_DISPOSITIVO)}</Badge>
    if(categoria===CATEGORIA_MEDICAMENTO)
        return <Badge variant="dispositivo">{capitalizeWord(CATEGORIA_MEDICAMENTO)}</Badge>
}