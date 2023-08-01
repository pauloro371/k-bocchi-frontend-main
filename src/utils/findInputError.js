
/**
 * 
 * @param {FieldErrors} errors Es el array de errores generados
 * @param {string} name Es el nombre del input del cual estamos buscando el error
 * 
 * @returns Un objeto representando el error.  ```
 *  error:{
 *    message: "",
 *    ref:input#name,
 *    type:
 *  }
 * ```
 */
export function findInputError(errors, name) {
  //Object.keys es una funcion que permite obtener las llaves de un objeto de javascript
    const filtered = Object.keys(errors)
      //Filter es una funcion que permite seleccionar objetos de un arreglo basandose en un predicado
      //Un predicado es una funcion que devuelve verdadero o falso, en este caso se revisa si la llave
      //actual es igual a "name"
      .filter(key => key.includes(name))
      //Reduce es una funcion que permite devolver un objeto, acumulando el resultado de cada iteracion
      //cur es el valor acumulado, key es el valor actual de la iteracion del arreglo
      .reduce((cur, key) => {
        //Assign es una funcion que permite añadir las propiedades de un objeto a otro, parecido a la destructuracion
        //En ese caso se obtiene el valor acumulado (cur) y se le agrega la propiedad "error" con el valor obtenido de "errors[key]"
        return Object.assign(cur, { error: errors[key] })
      }, {})
      
    return filtered
  }