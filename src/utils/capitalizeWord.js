//Permite poner como mayúscula la primer letra de una palabra
export function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

//Permite formatear un dato dependiendo se tu tipo
export function showDato(dato){
  if(typeof dato =="boolean")
    return dato ? "Si" : "No"
  return dato;
}
