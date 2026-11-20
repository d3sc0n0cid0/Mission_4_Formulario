
const API_Personajes = 'http://localhost:3000/personajes';
const API_Estados = 'http://localhost:3000/estado';
const API_Rol = 'http://localhost:3000/rol';

export async function BuscarPorNombre(objetoUseQuery) {
    //console.log(objetoUseQuery);
    const nombreBuscado = objetoUseQuery.queryKey[1] || "";

    const r = await fetch(API_Personajes);    
    if (!r.ok) throw new Error(`Error HTTP: ${r.status}`);
    const json = await r.json();

    //Si ni se escribe nada se muestran todos
    if (!nombreBuscado.trim()) return json;
    //Si se pone algo se busca con ese algo
    return json.filter((p) => p.nombre.includes(nombreBuscado.trim()));
}

//Actualizar un personaje existente
export async function actualizar({id, datosActualizados}) {

    console.log("ID:",id);
    console.log("Datos Actualizados:",datosActualizados);


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
  console.log("datos nuevo personaje:", datosNuevoPersonaje);

  //Para sacar que id es
  const resLista = await fetch(`${API_Personajes}`);
  if (!resLista.ok) throw new Error(`Error al obtener lista: ${resLista.status}`);
  const lista = await resLista.json();

  //Sumamos 1 para este nuevo
  const nuevoId = String(lista.length + 1);
  //TO-DO: Hacer un reduce que te devuelva el máximo

  //Se incluye en la lista
  const r = await fetch(`${API_Personajes}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: nuevoId, ...datosNuevoPersonaje }),
  });

  if (!r.ok) throw new Error(`Error al crear: ${r.status}`);
  return r.json();
}