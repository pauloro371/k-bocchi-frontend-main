/**
 * Esta función permite obtener la propiedad de un objeto
 * mediante un path/dirección de la propiedad que se requiere
 * @param {*} object El objeto como tal
 * @param {String} path La dirección de la propiedad
 * @example 
 * ```
 * const obj = {
 *      deep:{
 *          value: 1
 *          evenDeeper: {
 *              value: 2,
 *              evenEvenDeeper:{
 *                  enoughDeep: "Hello World!"
 *              }
 *          }
 *      },
 *      value: 1     
 * }
 * const path = "deep.evenDeeper.evenEvenDeeper.enoughDeep"
 * let value = getValueFromPath(obj,path);
 * console.log(value) //"Hello World!"
 * ```
 * @returns El valor de la propiedad. Si el valor no existe retorna undefined
 */
export default function getValueFromPath(object, path) {
  let o = path.split(".");
  if (object === null) return null;
  if (object === undefined) return undefined;
  if (o.length === 1) {
    return object[path];
  } else {
    return getValueFromPath(object[o[0]], o.slice(1).join("."));
  }
}
