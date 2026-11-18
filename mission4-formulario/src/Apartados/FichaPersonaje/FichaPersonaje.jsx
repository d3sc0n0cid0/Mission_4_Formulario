import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import {UsePersonajeUQ, useActualizarPersonaje} from '../Hooks/UsePersonajeUQ.jsx'

//zod
const esquemaRegistro = z.object({
        nombre: z.string().min(4, "El nombre es demasiado corto"),
    })

export function FichaPersonaje(){
    //Variables
        //UseState
    const [buscarNombre, setbuscarNombre] = useState("");
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
        //Use Querey
    const usePersonaje = UsePersonajeUQ(buscarNombre); //{ data = [], isPending, isError, error }
        //Mutate
    const actualizaPersonaje = useActualizarPersonaje(); //{ mutate, isPending: isUpdating, isSuccess, isError: isUpdateError }    
        //Use From
    const {
        register,        // conecta un input al formulario
        handleSubmit,    // envuelve nuestro onSubmit
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(esquemaRegistro),
    });
    async function handleClick(datos){
        console.log(datos); //4 render, dos nada mas inicializar la página otros 2 al enviar
        await new Promise((resolve) => setTimeout(resolve, 1000)); //Para que quede más bonito y se vea que está actualizando

        console.log(`ID: ${personajeSeleccionado.id}`);
        console.log("Datos:",datos);

        actualizaPersonaje.mutate(
            { id: personajeSeleccionado.id, datosActualizados: datos },
            {onSuccess: (personajeActualizado) => {
                console.log("Actualizado con éxito");
                setPersonajeSeleccionado(personajeActualizado);
            },}
        );
    };



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
            {usePersonaje.isPending && <p>Cargando...</p>}
            {usePersonaje.isError && <p role="alert">Error: {usePersonaje.error.message}</p>}

        {/*Lista de los personajes*/}
        <ul>
            {usePersonaje.data?.map((personaje) => (
            <li key={personaje.id}>
                <button
                type="button"
                onClick={() => {setPersonajeSeleccionado(personaje); reset(personaje)}}
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
        {/*Editar y actualizar datos de un personaje TO-DO: Poner los errores bonitos*/}

            {personajeSeleccionado && (
                <form onSubmit={handleSubmit(handleClick)}>
                    <h3>Editar ficha de {personajeSeleccionado.nombre}</h3>

                {/*Nombre personaje*/}
                    <label>Nombre: <input {...register("nombre")} /></label>
                    {errors.nombre && <span>{errors.nombre.message}</span>}


                    <button type="submit" disabled={actualizaPersonaje.isPending}>
                        {usePersonaje.isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                    {actualizaPersonaje.isSuccess && <p>Personaje actualizado correctamente.</p>}
                    {actualizaPersonaje.isError && <p role="alert">{actualizaPersonaje.error?.message}</p>}
                </form>
            )}
        </>
    )
}