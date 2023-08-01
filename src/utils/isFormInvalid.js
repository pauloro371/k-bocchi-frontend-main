
/**
 * 
 * @param {*} value Es el valor que se desea validar
 * @param {*} validations Es el arreglo de funciones para validar
 * @returns 
 */
export const executeValidation = (value, validations) => {
  //Se itera sobre todo el arreglo
  for (let index = 0; index < validations.length; index++) {
    //Se ejecuta cada funcion
    let result = validations[index](value);
    // console.log(result);
    //Si hay un error, se retorna
    if (result) return result;
  }
  return null;
};
