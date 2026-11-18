
const API_Personajes = 'http://localhost:3000/personajes';
const API_Estados = 'http://localhost:3000/estado';
const API_Rol = 'http://localhost:3000/rol';


export async function DatosPersonaje(){
    const respuesta = await fetch(API_Personajes);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json(); 
    return datos;
}
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

export async function EstadoPersonaje(){
    const respuesta = await fetch(API_Estados);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json(); 
    return datos;
}

export async function RolPersonaje(){
    const respuesta = await fetch(API_Rol);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json(); 
    return datos;
}