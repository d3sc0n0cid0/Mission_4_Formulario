import { useQuery } from "@tanstack/react-query";
import {DatosPersonaje, EstadoPersonaje, RolPersonaje, BuscarPorNombre} from '../FichaPersonaje/Api.jsx';

let todoslosPersonajes = [];

export function UsePersonajeUQ({ buscarNombre = "" }){

    console.log(`BuscarNombre = ${buscarNombre}`)

    const {data, isPending, isError, error} = useQuery({
        queryKey:["personaje",buscarNombre], //Identificador único caché
        queryFn: BuscarPorNombre, //Función que devuelve la promesa
    });

    if(isPending){
        return(<p>Cargando...</p>)
    }
    if(isError){
        return(<p>Error: {error.message}</p>)
    }
    todoslosPersonajes = data;
    console.log(data);

    return (
    <ul>
      {data.map((personaje) => (
        <li key={personaje.id}>
          {personaje.nombre} - {personaje.talento}
        </li>
      ))}
    </ul>
  );
}