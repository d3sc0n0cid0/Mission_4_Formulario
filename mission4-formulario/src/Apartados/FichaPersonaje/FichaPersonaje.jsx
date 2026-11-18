import { useEffect, useState } from "react";
import {UsePersonajeUQ} from '../Hooks/UsePersonajeUQ.jsx'
export function FichaPersonaje(){

    const [buscarNombre, setbuscarNombre] = useState("M");
    const [botonState, setBotonState] = useState(false);
    return(
        <>
            <label>Buscador:
                <input value={buscarNombre} onChange={(e) => setbuscarNombre(e.target.value)} placeholder="Introduce el nombre de un personaje ej:'MAKOTO'"/>
                <button onClick={()=>setBotonState(true)} >Buscar</button>
                {botonState && <UsePersonajeUQ buscarNombre={buscarNombre}/>}
            </label>
        </>
    )
}