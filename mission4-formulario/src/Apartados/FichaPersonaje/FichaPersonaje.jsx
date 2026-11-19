import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./FichaPersonaje.css"; // Importamos el CSS

import {UsePersonajeUQ, useActualizarPersonaje} from '../Hooks/UsePersonajeUQ.jsx'

//zod
const esquemaRegistro = z.object({
    nombre: z.string().min(4, "El nombre es demasiado corto"),
    altura: z.coerce.number({ invalid_type_error: "Debe ser un número válido"})
        .positive("La altura debe ser un número positivo").min(100,"Mínimo 100 cm").max(300,"Máximo 300 cm"),
    peso: z.coerce.number({ invalid_type_error: "Debe ser un número válido"})
        .positive("El peso debe ser un número positivo").min(30,"Mínimo 30 kg").max(500,"Máximo 500 kilogramos")    ,
    //bday:,
    //desc:,
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
        <div className="contenedor-ficha">
        <div className="buscador">
        {/*Buscador */}
            <label className="buscador">
                <input className="inputBusqueda"
                    value={buscarNombre} 
                    onChange={(e) => setbuscarNombre(e.target.value)} 
                    placeholder="Introduce el nombre de un personaje ej:'MAKOTO'"
                />
            </label>
        </div>
        {/*Mensajes de cargando/error TO-DO: Ponerlos luego bonitos*/}
            {usePersonaje.isPending && <p className="mensaje-info">Cargando...</p>}
            {usePersonaje.isError && <p className="mensaje-error" role="alert">Error: {usePersonaje.error.message}</p>}

        {/*Lista de los personajes*/}
        <div className="contenedor-lista-personajes">
            <ul className="lista-personajes">
                {usePersonaje.data?.map((personaje) => (
                <li key={personaje.id}>
                    <button
                    type="button"
                    onClick={() => {setPersonajeSeleccionado(personaje);
                        reset({ //Hace que estén los campos rellenos de default y así no tiene que meter todos los datos aunque solo vaya a editar 1
                        nombre: personaje.nombre,
                        altura: personaje.altura_cm,
                        peso: personaje.peso_kg,
                        bday: personaje.cumpleanos,
                        desc: personaje.descripcion,
                        });}}
                    >
                    {personaje.nombre} - {personaje.talento}
                    </button>
                </li>
                ))}
            </ul>
        </div>
      {/*Datos del personaje seleccionado TO-DO: Poner imagen del personaje*/}
        {personajeSeleccionado && (
            <div className="tarjeta-ficha">
                <h3>Ficha de {personajeSeleccionado.nombre}</h3>
                <p>Talento: {personajeSeleccionado.talento}</p>
                <p>Altura: {personajeSeleccionado.altura_cm} cm</p>
                <p>Peso: {personajeSeleccionado.peso_kg} kg</p>
                <p>Cumpleaños: {personajeSeleccionado.cumpleanos}</p>
                <p>Descripción: {personajeSeleccionado.descripcion}</p>
            </div>
        )}
        {/*Editar y actualizar datos de un personaje TO-DO: Poner los errores bonitos*/}

            {personajeSeleccionado && (
                <form className="formulario-edicion" onSubmit={handleSubmit(handleClick)}>
                    <h3>Editar ficha de {personajeSeleccionado.nombre}</h3>

                {/*Nombre personaje*/}
                    <label>Nombre: <input {...register("nombre")} /></label>
                    {errors.nombre && <span className="error-campo">{errors.nombre.message}</span>}

                    <label>Altura: <input {...register("altura")} /></label>
                    {errors.altura && <span className="error-campo">{errors.altura.message}</span>}

                     <label>Peso: <input {...register("peso")} /></label>
                    {errors.peso && <span className="error-campo">{errors.peso.message}</span>}

                    <label>Cumpleaños: <input {...register("bday")} /></label>
                    {errors.bday && <span className="error-campo">{errors.bday.message}</span>}

                    <label>Descripción: <input {...register("desc")} /></label>
                    {errors.desc && <span className="error-campo">{errors.desc.message}</span>}


                    <button type="submit" disabled={actualizaPersonaje.isPending}>
                        {usePersonaje.isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                    {actualizaPersonaje.isSuccess && <p className="mensaje-exito">Personaje actualizado correctamente.</p>}
                    {actualizaPersonaje.isError && <p className="mensaje-error" role="alert">{actualizaPersonaje.error?.message}</p>}
                </form>
            )}
        </div>
    )
}