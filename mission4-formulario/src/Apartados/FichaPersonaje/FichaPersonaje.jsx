import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./FichaPersonaje.css"; // Importamos el CSS

import {UsePersonajeUQ, useActualizarPersonaje, useCrearPersonaje, useSelectorRol, useSelectEstado, UseListaEstados, UseListaRoles} from '../Hooks/UsePersonajeUQ.jsx'

//zod
export const esquemaRegistro = z.object({
    nombre: z.string().min(4, "El nombre es demasiado corto"),
    talento: z.string().min(3, "El talento no puede estar vacío"),
    altura_cm: z.coerce.number({error: "Debe ser un número válido"})
        .positive("La altura debe ser un número positivo").min(100,"Mínimo 100 cm").max(300,"Máximo 300 cm"),
    peso_kg: z.coerce.number({ error: "Debe ser un número válido"})
        .positive("El peso debe ser un número positivo").min(30,"Mínimo 30 kg").max(500,"Máximo 500 kilogramos"),
    cumpleanos: z.string().min(5, "El cumpleaños no puede estar vacío"),
    descripcion: z.string().min(3, "La descripción debe tener algo"),
    estado: z.coerce.number({error:"Debes elegir un estado de tu personaje"}),
    rol:z.coerce.number({error:"Debes elegir un rol de tu personaje"}),
})

export function FichaPersonaje(){
    //Variables
        //UseState
    const [button, setbutton] = useState(null); //Para setear si estamos creando o actualizando (1 crear, 2 selectPersonaje)
    const [buscarNombre, setbuscarNombre] = useState("");
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const [rol, setRol] = useState(null);
    const [estado, setEstado] = useState(null);
        //Use Querey
    const usePersonaje = UsePersonajeUQ(buscarNombre); //{ data = [], isPending, isError, error }
    const {data: rolPersonaje} = useSelectorRol(rol);
    const {data: estadoPersonaje} = useSelectEstado(estado);
    const {data: ListaEstados} = UseListaEstados();
    const {data: ListaRoles} = UseListaRoles();
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

        actualizaPersonaje.mutate(
            { id: personajeSeleccionado.id, datosActualizados: datos },
            {onSuccess: (personajeActualizado) => {
                setPersonajeSeleccionado(personajeActualizado);
                setRol(personajeActualizado.rol);
                setEstado(personajeActualizado.estado);
                //isDirty -> false y el succes -> true
                reset(datos);
            },}
        );
    };
    async function handleClick_Crear(datos){
        
        crearPersonaje.mutate(
             datos,
            {onSuccess: (personajeCreado) => {
                setPersonajeSeleccionado(personajeCreado);
                setRol(personajeCreado.rol);
                setEstado(personajeActualizado.estado);
                //isDirty -> false y el succes -> true
                reset(datos);
                reset({ //Para que no se quede con los datos anteriores guardados
                        nombre: "",
                        talento: "",
                        altura_cm: "",
                        peso_kg: "",
                        cumpleanos: "",
                        descripcion: "",
                        estado:"",
                        rol:""
                        });
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
                setRol(null);
                setEstado(null);
                crearPersonaje.reset(); // Limpia mensajes de éxito/error anteriores
                reset({ //Porque si no, se quedan los datos del personaje anterior
                    nombre: "",
                    talento: "",
                    altura_cm: "",
                    peso_kg: "",
                    cumpleanos: "",
                    descripcion: "",
                    estado:"",
                    rol:""
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
                        estado: personaje.estado,
                        rol: personaje.rol,
                        });
                        setbutton(2);
                        setRol(personaje.rol);
                        setEstado(personaje.estado);
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
                <p>Estado: {estadoPersonaje?.estado}</p>
                <p>Rol: {rolPersonaje?.rol}</p>
            </div>
        )}
        {/*Editar y actualizar datos de un personaje*/}
            {personajeSeleccionado && button===2 && (
                <form className="formulario-edicion" onSubmit={handleSubmit(handleClick_Actualizar)}>
                    <h3>Editar ficha de {personajeSeleccionado.nombre}</h3>

                    <label>Nombre: <input {...register("nombre")} />
                        {errors.nombre && <span className="error-campo" role="alert">{errors.nombre.message}</span>}
                    </label>

                    <label>Talento: <input {...register("talento")} />
                        {errors.talento && <span className="error-campo" role="alert">{errors.talento.message}</span>}                
                    </label>

                    <label>Altura: <input type="number" {...register("altura_cm")} />
                        {errors.altura_cm && <span className="error-campo" role="alert">{errors.altura_cm.message}</span>}
                    </label>

                     <label>Peso: <input type="number" {...register("peso_kg")} />
                        {errors.peso_kg && <span className="error-campo" role="alert">{errors.peso_kg.message}</span>}
                     </label>

                    <label>Cumpleaños: <input {...register("cumpleanos")} />
                        {errors.cumpleanos && <span className="error-campo" role="alert">{errors.cumpleanos.message}</span>}
                    </label>

                    <label>Descripción: <input {...register("descripcion")} />
                        {errors.descripcion && <span className="error-campo" role="alert">{errors.descripcion.message}</span>}
                    </label>

                    <div className="radioButtons">
                        {ListaEstados?.map((estados) =>(
                            <label key={estados.id}>
                                <input type="radio" value={estados.id} {...register("estado")} />
                                {estados.estado}
                            </label>
                        ))}
                    </div>
                    <div className="radioButtons">
                        {ListaRoles?.map((roles) =>(
                            <label key={roles.id}>
                                <input type="radio" value={roles.id} {...register("rol")} />
                                {roles.rol}
                            </label>
                        ))}
                    </div>


                    <button type="submit" disabled={actualizaPersonaje.isPending}>
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                    {actualizaPersonaje.isSuccess && !isDirty && (<p className="mensaje-exito" role="alert">Personaje actualizado correctamente.</p>)}
                    {isDirty && (<p className="mensaje-sucio" role="alert">Los datos no han sido guardados</p>)}
                    {actualizaPersonaje.isError && <p className="mensaje-error" role="alert">{actualizaPersonaje.error?.message}</p>}
                </form>
            )}
        {/*Añadir un nuevo personaje*/}
            {button===1 && (
                <form className="formulario-edicion" onSubmit={handleSubmit(handleClick_Crear)}>
                    <h3>Crea un personaje:</h3>

                    <label>Nombre: <input {...register("nombre")} />
                        {errors.nombre && <span className="error-campo" role="alert">{errors.nombre.message}</span>}
                    </label>

                    <label>Talento: <input {...register("talento")} />
                    </label>
                        {errors.talento && <span className="error-campo" role="alert">{errors.talento.message}</span>}                

                    <label>Altura: <input type="number" {...register("altura_cm")} />
                        {errors.altura_cm && <span className="error-campo" role="alert">{errors.altura_cm.message}</span>}
                    </label>

                     <label>Peso: <input type="number" {...register("peso_kg")} />
                        {errors.peso_kg && <span className="error-campo" role="alert">{errors.peso_kg.message}</span>}
                     </label>

                    <label>Cumpleaños: <input {...register("cumpleanos")} />
                        {errors.cumpleanos && <span className="error-campo" role="alert">{errors.cumpleanos.message}</span>}
                    </label>

                    <label>Descripción: <input {...register("descripcion")} />
                        {errors.descripcion && <span className="error-campo" role="alert">{errors.descripcion.message}</span>}
                    </label>

                    <div className="radioButtons">
                        {ListaEstados?.map((estados) =>(
                            <label key={estados.id}>
                                <input type="radio" value={estados.id} {...register("estado")} />
                                {estados.estado}
                            </label>
                        ))}
                    </div>
                    <div className="radioButtons">
                        {ListaRoles?.map((roles) =>(
                            <label key={roles.id}>
                                <input type="radio" value={roles.id} {...register("rol")} />
                                {roles.rol}
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={crearPersonaje.isPending}>
                            {crearPersonaje.isPending ? "Creando…" : "Crear usuario"}
                    </button>
                    {crearPersonaje.isSuccess && !isDirty && (<p className="mensaje-exito" role="alert">Personaje creado correctamente.</p>)}
                    {isDirty && (<p className="mensaje-sucio" role="alert">Los datos no han sido guardados</p>)}
                    {crearPersonaje.isError && <p className="mensaje-error" role="alert">{crearPersonaje.error?.message}</p>}
                </form>
            )}
        </div>
    )
}