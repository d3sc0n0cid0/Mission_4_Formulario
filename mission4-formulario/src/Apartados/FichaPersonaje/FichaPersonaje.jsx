import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./FichaPersonaje.css"; // Importamos el CSS

import {UsePersonajeUQ, useActualizarPersonaje, useCrearPersonaje} from '../Hooks/UsePersonajeUQ.jsx'

//zod
const esquemaRegistro = z.object({
    nombre: z.string().min(4, "El nombre es demasiado corto"),
    talento: z.string().min(3, "El talento no puede estar vacío"),
    altura_cm: z.coerce.number({ invalid_type_error: "Debe ser un número válido"})
        .positive("La altura debe ser un número positivo").min(100,"Mínimo 100 cm").max(300,"Máximo 300 cm"),
    peso_kg: z.coerce.number({ invalid_type_error: "Debe ser un número válido"})
        .positive("El peso debe ser un número positivo").min(30,"Mínimo 30 kg").max(500,"Máximo 500 kilogramos"),
    cumpleanos: z.string().min(10, "El cumpleaños no puede estar vacío"),
    descripcion: z.string().min(3, "La descripción debe tener algo"),
})

export function FichaPersonaje(){
    //Variables
        //UseState
    const [button, setbutton] = useState(null); //Para setear si estamos creando o actualizando (1 crear, 2 selectPersonaje)
    const [buscarNombre, setbuscarNombre] = useState("");
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
        //Use Querey
    const usePersonaje = UsePersonajeUQ(buscarNombre); //{ data = [], isPending, isError, error }
        //Mutate
    const actualizaPersonaje = useActualizarPersonaje(); //{ mutate, isPending: isUpdating, isSuccess, isError: isUpdateError }
    const crearPersonaje = useCrearPersonaje();   
        //Use From
    const {
        register,        // conecta un input al formulario
        handleSubmit,    // envuelve nuestro onSubmit
        reset,
        formState: { errors, isSubmitting, isDirty, isError },
    } = useForm({
        resolver: zodResolver(esquemaRegistro),
    });
    async function handleClick_Actualizar(datos){
        console.log(datos); //4 render, dos nada mas inicializar la página otros 2 al enviar
        console.log(`ID: ${personajeSeleccionado.id}`);
        console.log("Datos:",datos);

        actualizaPersonaje.mutate(
            { id: personajeSeleccionado.id, datosActualizados: datos },
            {onSuccess: (personajeActualizado) => {
                console.log("Actualizado con éxito");
                setPersonajeSeleccionado(personajeActualizado);
                //isDirty -> false y el succes -> true
                reset(datos);
            },}
        );
    };
        async function handleClick_Crear(datos){
        console.log(datos); 
        
        crearPersonaje.mutate(
             datos,
            {onSuccess: (personajeCreado) => {
                console.log("Actualizado con éxito");
                setPersonajeSeleccionado(personajeCreado);
                //isDirty -> false y el succes -> true
                reset(datos);
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
        {/*Botón de crear nuevo personaje*/}
        <div className="crearPersonaje">
            <button type="button"
                onClick={() => {setbutton(1);
                setPersonajeSeleccionado(null);
                crearPersonaje.reset(); // Limpia mensajes de éxito/error anteriores
                reset({ //Porque si no, se quedan los datos del personaje anterior
                    nombre: "",
                    talento: "",
                    altura_cm: "",
                    peso_kg: "",
                    cumpleanos: "",
                    descripcion: "",
                });
            }}>Crear Personaje</button>
        </div>
        {/*Mensajes de cargando/error*/}
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
                        talento: personaje.talento,
                        altura_cm: personaje.altura_cm,
                        peso_kg: personaje.peso_kg,
                        cumpleanos: personaje.cumpleanos,
                        descripcion: personaje.descripcion,
                        });
                        setbutton(2);
                    }}
                    >
                    {personaje.nombre} - {personaje.talento}
                    </button>
                </li>
                ))}
            </ul>
        </div>
      {/*Datos del personaje seleccionado TO-DO: Poner imagen del personaje*/}
        {personajeSeleccionado && button===2 && (
            <div className="tarjeta-ficha">
                <h3>Ficha de {personajeSeleccionado.nombre}</h3>
                <p>Talento: {personajeSeleccionado.talento}</p>
                <p>Altura: {personajeSeleccionado.altura_cm} cm</p>
                <p>Peso: {personajeSeleccionado.peso_kg} kg</p>
                <p>Cumpleaños: {personajeSeleccionado.cumpleanos}</p>
                <p>Descripción: {personajeSeleccionado.descripcion}</p>
            </div>
        )}
        {/*Editar y actualizar datos de un personaje*/}
            {personajeSeleccionado && button===2 && (
                <form className="formulario-edicion" onSubmit={handleSubmit(handleClick_Actualizar)}>
                    <h3>Editar ficha de {personajeSeleccionado.nombre}</h3>

                    <label>Nombre: <input {...register("nombre")} /></label>
                    {errors.nombre && <span className="error-campo">{errors.nombre.message}</span>}

                    <label>Talento: <input {...register("talento")} /></label>
                    {errors.talento && <span className="error-campo">{errors.talento.message}</span>}                

                    <label>Altura: <input {...register("altura_cm")} /></label>
                    {errors.altura_cm && <span className="error-campo">{errors.altura_cm.message}</span>}

                     <label>Peso: <input {...register("peso_kg")} /></label>
                    {errors.peso_kg && <span className="error-campo">{errors.peso_kg.message}</span>}

                    <label>Cumpleaños: <input {...register("cumpleanos")} /></label>
                    {errors.cumpleanos && <span className="error-campo">{errors.cumpleanos.message}</span>}

                    <label>Descripción: <input {...register("descripcion")} /></label>
                    {errors.descripcion && <span className="error-campo">{errors.descripcion.message}</span>}


                    <button type="submit" disabled={actualizaPersonaje.isPending}>
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                    {actualizaPersonaje.isSuccess && !isDirty && (<p className="mensaje-exito">Personaje actualizado correctamente.</p>)}
                    {isDirty && (<p className="mensaje-sucio">Los datos no han sido guardados</p>)}
                    {actualizaPersonaje.isError && <p className="mensaje-error" role="alert">{actualizaPersonaje.error?.message}</p>}
                </form>
            )}
        {/*Añadir un nuevo personaje*/}
            {button===1 && (
                <form className="formulario-edicion" onSubmit={handleSubmit(handleClick_Crear)}>
                    <h3>Crea un personaje:</h3>

                    <label>Nombre: <input {...register("nombre")} /></label>
                    {errors.nombre && <span className="error-campo">{errors.nombre.message}</span>}

                    <label>Talento: <input {...register("talento")} /></label>
                    {errors.talento && <span className="error-campo">{errors.talento.message}</span>}                

                    <label>Altura: <input {...register("altura_cm")} /></label>
                    {errors.altura_cm && <span className="error-campo">{errors.altura_cm.message}</span>}

                     <label>Peso: <input {...register("peso_kg")} /></label>
                    {errors.peso_kg && <span className="error-campo">{errors.peso_kg.message}</span>}

                    <label>Cumpleaños: <input {...register("cumpleanos")} /></label>
                    {errors.cumpleanos && <span className="error-campo">{errors.cumpleanos.message}</span>}

                    <label>Descripción: <input {...register("descripcion")} /></label>
                    {errors.descripcion && <span className="error-campo">{errors.descripcion.message}</span>}


                    <button type="submit" disabled={crearPersonaje.isPending}>
                            {crearPersonaje.isPending ? "Creando…" : "Crear usuario"}
                    </button>
                    {crearPersonaje.isSuccess && !isDirty && (<p className="mensaje-exito">Personaje creado correctamente.</p>)}
                    {isDirty && (<p className="mensaje-sucio">Los datos no han sido guardados</p>)}
                    {crearPersonaje.isError && <p className="mensaje-error" role="alert">{crearPersonaje.error?.message}</p>}
                </form>
            )}
        </div>
    )
}