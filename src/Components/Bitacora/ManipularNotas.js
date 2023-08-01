import { FormatDate } from "../../utils/fechas";

export function addTop(nota, setNotas, grupoPrevio) {
  setNotas((notas) => {
    let notasNew = [ ...notas ];
    let fecha = FormatDate(nota.fecha_edicion);
    let fechaIndex = notasNew.findIndex((v)=>v.header===fecha)
    let n = notasNew.findIndex((v)=>v.header===grupoPrevio);
    notasNew[n].notas = notasNew[n].notas.filter(
      (n) => n.id !== nota.id
    );

    notasNew[fechaIndex].notas.unshift(nota);
    return notasNew;
  });
}
export function erase(nota, setNotas) {
  setNotas((notas) => {
    let notasNew = [ ...notas ]
    let fecha = FormatDate(nota.fecha_edicion);
    let n = notasNew.findIndex(({header})=>header===fecha);
    notasNew[n].notas = notasNew[n].notas.filter((n) => n.id !== nota.id);
    return notasNew;
  });
}
