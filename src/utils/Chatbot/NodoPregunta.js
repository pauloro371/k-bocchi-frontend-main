import { MensajeVolver } from "../../Components/Chatbot/MensajeVolver";


/**
 * Esta es la clase que representa cada pregunta/nodo de las preguntas del chatbot
 */
export default class NodoPregunta {
  //addMensaje es la funcion que permite agregar las respuestas del chatbot
  static addMensaje = null;
  //setPregunta permite establecer la pregunta actual
  static setPregunta = null;
  //opciones es arreglo posibles respuestas que el usuario peude dar
  static opciones = [];
  //El nodo inicial
  static NodoInicial = null;
  //El id del paciente
  static id_paciente = null;
  /**
   * datos = {
   *  cita: citaObject,
   *  terapeuta: terapeutaObject
   * }
   */
  //Son los datos del usuario y su cita
  static datos = null;
  //La función que permite cambiar los datos
  static setDatos(dato) {
    this.datos = { ...this.datos, ...dato };
    console.log("Datos changed: ", { ...this.datos });
  }
  //El constructor recibe los paremetros necesarios para crear una pregunta
  constructor(
    anterior,
    siguiente,
    onIncorrecto,
    onCorrecto,
    pregunta,
    onEnvio,
    onInit = () => true
  ) {
    //Es la pregunta que sigue
    this.pregunta = pregunta;
    this.anterior = anterior;
    this.siguiente = siguiente;
    //es la funcion que específica que se tiene que hacer cuando algo sale mal
    this.onIncorrecto = onIncorrecto;
    //Es la funcion que específica que hay que hacer cuando se responde correctamente
    this.onCorrecto = onCorrecto;
    //Es la funcion que se ejecuta cuando se envia la respuesta
    this.onEnvio = onEnvio;
    //Es la funcion que se ejecuta inicialmente en cuanto se carga la pregunta
    this.onInit = onInit;
  }
  //onSubmit es la funcion que recibe la respuesta del usuario
  async onSubmit(value) {
    //Si el usuario escribio #Volver, entonces se regresa a la primer pregunta y se resetean los datos
    if (value === "#Volver") {
      NodoPregunta.datos = null;
      NodoPregunta.setPregunta(NodoPregunta.NodoInicial);
      return;
    }
    //Si no es volver, se ejecuta la función de onEnvio de la pregunta
    try {
      //Se guarda la respuesta
      let respuesta = await this.onEnvio(value);
      //Y se ejecuta la función de onCorrecto con la respuesta obtenida
      this.onCorrecto(respuesta);
    } catch (err) {
      console.log("MISTAKE:", err);
      //Si algo sale mal, se ejecuta onIncorrecto con el error obtenido
      this.onIncorrecto(err);
      //Y agregamos un mensaje para indicar como volver al menu principal
      NodoPregunta.addMensaje(<MensajeVolver />);
    }
  }
}
