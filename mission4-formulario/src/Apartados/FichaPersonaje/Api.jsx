import { z } from "zod";
import {esquemaRegistro} from './FichaPersonaje.jsx'; //Para poder hacer el parse

const API_Personajes = 'http://localhost:3000/personajes';
const API_Estados = 'http://localhost:3000/estado';
const API_Rol = 'http://localhost:3000/rol';

export async function BuscarPorNombre(objetoUseQuery) {
  const esquemaListaPersonajes = z.array(esquemaRegistro);
  const nombreBuscado = objetoUseQuery.queryKey[1] || "";

  const r = await fetch(API_Personajes);    
  if (!r.ok) throw new Error(`Error HTTP: ${r.status}`);
  const json = await r.json();

  //Si ni se escribe nada se muestran todos
  if (!nombreBuscado.trim()) return json;
  //Si se pone algo se busca con ese algo
  const listaPersonajes = json.filter((p) =>  p.nombre.toLowerCase().includes(nombreBuscado.trim().toLowerCase()));
  return esquemaListaPersonajes.parse(listaPersonajes); // valida y tipa la respuesta

}
//Para que me devuelva la lista de estados
export async function ListaEstados() {
  const r = await fetch(`${API_Estados}`);
      if (!r.ok) throw new Error("Error al cargar estados");
      return r.json();
}
//Para que me devuelva la lista de rol
export async function ListaRoles() {
  const r = await fetch(`${API_Rol}`);
      if (!r.ok) throw new Error("Error al cargar roles");
      return r.json();
}

//Actualizar un personaje existente
export async function actualizar({id, datosActualizados}) {
  const r = await fetch(`${API_Personajes}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  if (!r.ok) throw new Error("Error al actualizar");
  return r.json();
}

//Crear un nuevo personaje
export async function crear(datosNuevoPersonaje) {
  //Para sacar que id es
  const resLista = await fetch(`${API_Personajes}`);
  if (!resLista.ok) throw new Error(`Error al obtener lista: ${resLista.status}`);
  const lista = await resLista.json();

  // Calculamos el id máximo
  let idMax = 0;
  lista.forEach((personaje) => {
    const numId = Number(personaje.id);
    if (numId > idMax) {
      idMax = numId;
    }
  });
  const nuevoId = String(idMax + 1);
  console.log(nuevoId);
  
  //Se incluye en la lista
  const r = await fetch(`${API_Personajes}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: String(nuevoId), ...datosNuevoPersonaje }),
  });

  if (!r.ok) throw new Error(`Error al crear: ${r.status}`);
  return r.json();
}


//Para sacar lo de rol
export async function selectRol(objetoUseQuery) {
  const rol_num = objetoUseQuery.queryKey[1];

  const r = await fetch(`${API_Rol}`);
  if (!r.ok) throw new Error(`Error al obtener el rol: ${r.status}`);
  const rol = await r.json();

  return rol[rol_num] ?? null; // Nunca devuelve undefined
}

//Para sacar lo de estado
export async function selectEstado(objetoUseQuery){
  const estado_num = objetoUseQuery.queryKey[1];

  const r = await fetch(`${API_Estados}`); 
  if (!r.ok) throw new Error(`Error al obtener el estado: ${r.status}`);
  const estado = await r.json();

  
  console.log(estado[estado_num]);

  return estado[estado_num] ?? null;
}