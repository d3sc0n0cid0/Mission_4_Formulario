import { useQuery,  useMutation, useQueryClient  } from "@tanstack/react-query";

import {BuscarPorNombre, actualizar} from '../FichaPersonaje/Api.jsx';


export function UsePersonajeUQ( buscarNombre = "" ){

    //console.log(`BuscarNombre = ${buscarNombre}`)
  //Consigo los datos y los recojo fuera para usarlos
    return useQuery({ //Devolvemos lo del data, el pending y demás para usarlo en Ficha Personaje
      queryKey: ["personaje", buscarNombre],
      queryFn: BuscarPorNombre,
  });
}

//Manejamos la actualización del personaje
export function useActualizarPersonaje() {

  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: actualizar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personaje"] }); //Invalidamos la query para que se refresque la lista
    },
  });
}