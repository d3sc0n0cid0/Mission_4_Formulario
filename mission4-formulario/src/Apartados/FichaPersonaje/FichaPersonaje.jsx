import { useEffect, useState } from "react";
import {UsePersonajeUQ} from '../Hooks/UsePersonajeUQ.jsx'
export function FichaPersonaje(){

    const [buscarNombre, setbuscarNombre] = useState(" ");
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);

    const { data = [], isPending, isError, error } = UsePersonajeUQ(buscarNombre);

    return(
        <>
        {/*Buscador */}
            <label>Buscador:
                <input 
                    value={buscarNombre} 
                    onChange={(e) => setbuscarNombre(e.target.value)} 
                    placeholder="Introduce el nombre de un personaje ej:'MAKOTO'"
                />
            </label>

        {/*Mensajes de cargando/error TO-DO: Ponerlos luego bonitos*/}
            {isPending && <p>Cargando...</p>}
            {isError && <p role="alert">Error: {error.message}</p>}

        {/*Lista de los personajes*/}
        <ul>
            {data.map((personaje) => (
            <li key={personaje.id}>
                <button
                type="button"
                onClick={() => setPersonajeSeleccionado(personaje)}
                >
                {personaje.nombre} - {personaje.talento}
                </button>
            </li>
            ))}
        </ul>

      {/*Datos del personaje seleccionado TO-DO: Poner imagen del personaje*/}
        {personajeSeleccionado && (
            <div>
                <h3>Ficha de {personajeSeleccionado.nombre}</h3>
                <p>________________________________________________</p>
                <p>Talento: {personajeSeleccionado.talento}</p>
                <p>Altura: {personajeSeleccionado.altura_cm} cm</p>
                <p>Peso: {personajeSeleccionado.peso_kg} kg</p>
                <p>Cumpleaños: {personajeSeleccionado.cumpleanos}</p>
                <p>Descripción: {personajeSeleccionado.descripcion}</p>
                <p>________________________________________________</p>
            </div>
        )}
        {personajeSeleccionado &&(
            <div>
                <button Ah></button>
            </div>
        )}
        </>
    )
}