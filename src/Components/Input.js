import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { findInputError } from "../utils/findInputError";
import { isFormInvalid } from "../utils/isFormInvalid";

//Recibe
/**
 * - label: Es el contenido de la etiqueta html label del componente
 * - name: Es el valor que permite vincular la etiqueta html label e input.
 * - setValue: setValue es una función que permite vincular el estado del input del componente con
 *             algun valor externo al mismo.
 * - validacion: Es un objeto que contiene las propiedades para validar el input mediante la librería
 *               "react-hook-form"
 *
 */

//Como se usa
/**
 *
 * @param {label} string el contenido de la etiqueta html label del componente
 * @param {name} string el valor que permite vincular la etiqueta html label e input
 * @param {setValue} function es una función que permite vincular el estado del input del componente con algun valor externo al mismo
 * @param {validacion} RegisterOptions es un objeto que contiene las validaciones a ejecutar sobre los valores introducidos por el usuario
 * @description Este componente es una extensión que permite validar el valor que el usuario introduce. Para su correcto funcionamiento tiene que estar dentro de
 * un FormProvider
 * 
 * @example
 * ```
 * const methods = useForm()
 * const [correo,setCorreo] = useState("")
 * 
 * <FormProvider {...methods}>
 *    <Input
 *      value="pepe@gmail.com"
 *      setValue={(value)=>setCorreo(value)} //Aqui se vincula el estado "correo" con el valor que el usuario escriba en "Input"
 *      name="correo"
 *    />
 * </FormProvider>
 * ```
 * @returns Una instancia del componente Input
 */
//Devuelve
function Input({ label, name, setValue, validacion, ...props }) {
  //controlledValue es la variable que permite almacenar el valor actual del input
  //mientras que setControllerValue permite modificar "controlledValue"
  //se inicializa "controlledValue" al valor que se pase como parametro en "props"
  const [controlledValue, setControlledValue] = useState(props.value);
  //register es una funcion que permite añadir al contexto del formulario un input
  //formState es un objeto que contiene una representación del contexto del formulario
  //useFormContext es una función que permite obtener los métodos necesarios para interactuar con el contexto del formulario
  const { register, formState } = useFormContext();
  //obtenemos la propiedad "errors" del objeto "formState" mediante destructuración
  //esta propiedad almacena los errores de validación del formulario en un objeto de esta forma:
  /**
   * {
   *    nombre_campo_1:{
   *      message:"mensaje de error"
   *      . . .
   *    },
   *    nombre_campo_2:{
   *      message:"mensaje de error"
   *      . . .
   *    }
   * }
   * */
  const { errors } = formState;
  //con la función ''findInputError'' se obtiene el error asociado al input actual y lo guardamos en "error"
  const { error } = findInputError(errors, name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {error && <InputError message={error.message} />}
      {/* Aqui se suscribe el input llamando a la funcion register, pasandole "name" y el objeto de "validacion" como parametro
          "name" sera el nombre que tendra el input en el contexto del formulario
       */}
      <input
        {...register(name, validacion)}
        {...props}
        value={controlledValue}
        name={name}
        onChange={(e) => {
          setControlledValue(e.target.value);
          setValue(e.target.value);
          console.log(e);
        }}
      />
    </div>
  );
}
const InputError = ({ message }) => {
  return <div>{message}</div>;
};
export default Input;
