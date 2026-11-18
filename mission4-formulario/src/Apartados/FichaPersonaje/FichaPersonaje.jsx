import { useEffect, useState } from "react";
import {UsePersonajeUQ} from '../Hooks/UsePersonajeUQ.jsx'
export function FichaPersonaje(){

    const [buscarNombre, setbuscarNombre] = useState("Makoto");
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
                <button type="button" onClick={() => setFiltro(textoInput)}> Buscar </button>
            </label>

        {/*Mensajes de cargando/error TO-DO: Ponerlos luego bonitos*/}
            {isPending && <p>Cargando...</p>}
            {isError && <p role="alert">Error: {error.message}</p>}

        {/*Lista de los personajes que coincidan con lo que se está buscandi*/}
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

      {/*Datos del personaje seleccionado*/}
        {personajeSeleccionado && (
            <div>
                <h3>Ficha de {personajeSeleccionado.nombre}</h3>
                <p>Talento: {personajeSeleccionado.talento}</p>
                <p>Altura: {personajeSeleccionado.altura_cm} cm</p>
                <p>Peso: {personajeSeleccionado.peso_kg} kg</p>
                <p>Cumpleaños: {personajeSeleccionado.cumpleanos}</p>
                <p>Descripción: {personajeSeleccionado.descripcion}</p>
            </div>
        )}
        </>
    )
}