# Mission_4_Formulario

He creado yo la API con npx json-server db.json

## Descripción
    Se trata de una página web que muetra a los personajesdel primer juego de danganrompa, puedes editar sus campos además de añadir personajes

## Uso de IA
He usado la IA de gemini

1. No se porque, intentando hacer lo de sacar el rol, no me estaba funcionando aunque lo estaba haciendo casi igual que buscar personaje, al final tras estar intentando sacarlo, le pregunte y resulta que tenía que poner data: delante de las variables qu estaba obteniendo de useSelectorRol, y tenía mal escrita una cosa

2. Quería hacer los radioButtons de forma que fuera echos por código por si algún día añadía más o menos, pero no sabía como mostrarlos sin un for, y no se puede con map por obvias razones, entonces cómo no encontraba nada, pregunté si existía alguna funcion que fuera como un map para número enteros y me habló de 
    {Array.from({ length: Tamaño || 0 }, (_, index) => ()}
Que hacía justo lo que quería. Aunque luego lo tuve que cambiar porque quería poner que se mostrase que te daba la opción y no podía hacerlo así


## Autopsia
Las 2 decisiones más discutibles de tu código y qué alternativa descartaste en cada una.

1. Estaba pensando originalmente, que aparte de hacer el trabajo base, añadir un minijuego de adivna el personaje, donde apartir de tu poner nombres te ponía si tenía el mismo estado, nombre, altura etc. del personaje. Pero no era relevante para la nota así que lo acabé descartando.

2. Quería que los id fueran en orden, pero por alguna razón da igual lo que hiciera 
    JSON.stringify({ id: String(nuevoId), ...datosNuevoPersonaje }),
    me daba siempre un id aleatorío al que no podía encontrarle lógica, así que los ids creados son aleatorios, en ciarta forma los hacen más seguros
