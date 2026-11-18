import { useQuery } from "@tanstack/react-query";
import {DatosPersonaje, EstadoPersonaje, RolPersonaje, BuscarPorNombre} from '../FichaPersonaje/Api.jsx';


export function UsePersonajeUQ( buscarNombre = "" ){

    console.log(`BuscarNombre = ${buscarNombre}`)
  //Consigo los datos y los recojo fuera para usarlos
    return useQuery({ //Devolvemos lo del data, el pending y demás para usarlo en Ficha Personaje
      queryKey: ["personaje", buscarNombre],
      queryFn: BuscarPorNombre,
  });
}

