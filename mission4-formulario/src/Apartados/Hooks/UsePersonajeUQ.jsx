import { useQuery,  useMutation, useQueryClient  } from "@tanstack/react-query";

import {BuscarPorNombre, actualizar, crear, selectRol, selectEstado, ListaEstados, ListaRoles} from '../FichaPersonaje/Api.jsx';

//Manejamos la búsqueda de un personaje por nombre
export function UsePersonajeUQ( buscarNombre = "" ){
  //Consigo los datos y los recojo fuera para usarlos
    return useQuery({ //Devolvemos lo del data, el pending y demás para usarlo en Ficha Personaje
      queryKey: ["personaje", buscarNombre],
      queryFn: BuscarPorNombre,
  });
}
//Manejamos el devolver la lista de estados
export function UseListaEstados( ){
    return useQuery({
      queryKey: ["estados"],
      queryFn: ListaEstados,
  });
}
export function UseListaRoles(){
  return useQuery({
    queryKey: ["roles"],
    queryFn: ListaRoles,
  })
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

//Manejamos la creación del personaje
export function useCrearPersonaje() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personaje"] }); //Invalidamos la query para que se refresque la lista
    },
  });
}

//Para sacar el rol
export function useSelectorRol(rol_num) {
  const tieneRol = rol_num !== undefined && rol_num !== null && rol_num !== "";

  return useQuery({
    queryKey: ["rol", rol_num],
    queryFn: selectRol,
    enabled: tieneRol, // Solo hace fetch cuando hay un rol_num válido
  });
}
//Para sacar el estado
export function useSelectEstado(estado_num) {
  const tieneEstado = estado_num !== undefined && estado_num !== null && estado_num !== "";

  return useQuery({
    queryKey: ["estado", estado_num],
    queryFn: selectEstado,
    enabled: tieneEstado,
  });
}
