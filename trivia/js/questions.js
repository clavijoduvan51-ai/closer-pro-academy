/**
 * Banco de preguntas de cultura general en español.
 * Estructura: { categoria, dificultad ('facil'|'medio'|'dificil'), pregunta, opciones, correcta (index) }
 * Las opciones se barajan en tiempo de juego.
 */
window.TRIVIA_CATEGORIES = [
  { id: "mixto", nombre: "Mixta (todas)" },
  { id: "historia", nombre: "Historia" },
  { id: "geografia", nombre: "Geografía" },
  { id: "ciencia", nombre: "Ciencia y Naturaleza" },
  { id: "deportes", nombre: "Deportes" },
  { id: "arte", nombre: "Arte y Literatura" },
  { id: "musica", nombre: "Música" },
  { id: "cine", nombre: "Cine y TV" },
  { id: "tecnologia", nombre: "Tecnología" },
];

window.TRIVIA_QUESTIONS = [
  // ===== HISTORIA =====
  { categoria: "historia", dificultad: "facil", pregunta: "¿En qué año llegó Cristóbal Colón a América?", opciones: ["1492", "1500", "1453", "1521"], correcta: 0 },
  { categoria: "historia", dificultad: "facil", pregunta: "¿Quién fue el primer presidente de los Estados Unidos?", opciones: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correcta: 2 },
  { categoria: "historia", dificultad: "medio", pregunta: "¿En qué año cayó el muro de Berlín?", opciones: ["1985", "1989", "1991", "1995"], correcta: 1 },
  { categoria: "historia", dificultad: "medio", pregunta: "¿Qué civilización construyó Machu Picchu?", opciones: ["Azteca", "Maya", "Inca", "Olmeca"], correcta: 2 },
  { categoria: "historia", dificultad: "dificil", pregunta: "¿Quién fue el último zar de Rusia?", opciones: ["Pedro el Grande", "Nicolás II", "Iván el Terrible", "Alejandro III"], correcta: 1 },
  { categoria: "historia", dificultad: "dificil", pregunta: "¿En qué año comenzó la Primera Guerra Mundial?", opciones: ["1914", "1918", "1905", "1923"], correcta: 0 },
  { categoria: "historia", dificultad: "facil", pregunta: "¿Quién pintó la Mona Lisa?", opciones: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Botticelli"], correcta: 1 },
  { categoria: "historia", dificultad: "medio", pregunta: "¿Cuál fue la primera capital del Imperio Romano?", opciones: ["Roma", "Constantinopla", "Atenas", "Cartago"], correcta: 0 },
  { categoria: "historia", dificultad: "medio", pregunta: "¿En qué país nació Napoleón Bonaparte?", opciones: ["Francia", "Italia", "Córcega (Francia)", "España"], correcta: 2 },
  { categoria: "historia", dificultad: "dificil", pregunta: "¿Qué tratado puso fin a la Primera Guerra Mundial?", opciones: ["Tratado de Tordesillas", "Tratado de Versalles", "Tratado de Utrecht", "Tratado de Westfalia"], correcta: 1 },

  // ===== GEOGRAFÍA =====
  { categoria: "geografia", dificultad: "facil", pregunta: "¿Cuál es la capital de Francia?", opciones: ["Lyon", "Marsella", "París", "Niza"], correcta: 2 },
  { categoria: "geografia", dificultad: "facil", pregunta: "¿En qué continente se encuentra Egipto?", opciones: ["Asia", "África", "Europa", "Oceanía"], correcta: 1 },
  { categoria: "geografia", dificultad: "facil", pregunta: "¿Cuál es el río más largo del mundo?", opciones: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correcta: 0 },
  { categoria: "geografia", dificultad: "medio", pregunta: "¿Cuál es el país más poblado del mundo?", opciones: ["China", "India", "Estados Unidos", "Indonesia"], correcta: 1 },
  { categoria: "geografia", dificultad: "medio", pregunta: "¿Cuál es la capital de Australia?", opciones: ["Sídney", "Melbourne", "Canberra", "Perth"], correcta: 2 },
  { categoria: "geografia", dificultad: "medio", pregunta: "¿En qué país se encuentra el Taj Mahal?", opciones: ["Pakistán", "India", "Bangladés", "Nepal"], correcta: 1 },
  { categoria: "geografia", dificultad: "dificil", pregunta: "¿Cuál es la moneda oficial de Vietnam?", opciones: ["Yen", "Dong", "Rupia", "Won"], correcta: 1 },
  { categoria: "geografia", dificultad: "dificil", pregunta: "¿Qué país tiene la mayor cantidad de islas del mundo?", opciones: ["Indonesia", "Filipinas", "Suecia", "Japón"], correcta: 2 },
  { categoria: "geografia", dificultad: "facil", pregunta: "¿En qué país está la Torre Eiffel?", opciones: ["Italia", "España", "Francia", "Bélgica"], correcta: 2 },
  { categoria: "geografia", dificultad: "medio", pregunta: "¿Cuál es el desierto más grande del mundo?", opciones: ["Sahara", "Gobi", "Antártico", "Atacama"], correcta: 2 },

  // ===== CIENCIA =====
  { categoria: "ciencia", dificultad: "facil", pregunta: "¿Cuál es el planeta más cercano al Sol?", opciones: ["Venus", "Mercurio", "Marte", "Tierra"], correcta: 1 },
  { categoria: "ciencia", dificultad: "facil", pregunta: "¿Qué gas respiramos principalmente?", opciones: ["Oxígeno", "Nitrógeno", "Hidrógeno", "Dióxido de carbono"], correcta: 1 },
  { categoria: "ciencia", dificultad: "facil", pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?", opciones: ["206", "201", "212", "198"], correcta: 0 },
  { categoria: "ciencia", dificultad: "medio", pregunta: "¿Cuál es el símbolo químico del oro?", opciones: ["Or", "Au", "Ag", "Go"], correcta: 1 },
  { categoria: "ciencia", dificultad: "medio", pregunta: "¿Quién propuso la teoría de la relatividad?", opciones: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"], correcta: 1 },
  { categoria: "ciencia", dificultad: "medio", pregunta: "¿Cuál es el órgano más grande del cuerpo humano?", opciones: ["Hígado", "Pulmones", "Piel", "Intestino"], correcta: 2 },
  { categoria: "ciencia", dificultad: "dificil", pregunta: "¿Cuál es la velocidad de la luz en el vacío (aproximada)?", opciones: ["300.000 km/s", "150.000 km/s", "1.000.000 km/s", "30.000 km/s"], correcta: 0 },
  { categoria: "ciencia", dificultad: "dificil", pregunta: "¿Qué partícula elemental no tiene carga eléctrica?", opciones: ["Protón", "Electrón", "Neutrón", "Positrón"], correcta: 2 },
  { categoria: "ciencia", dificultad: "facil", pregunta: "¿Cuántos planetas hay en el sistema solar?", opciones: ["7", "8", "9", "10"], correcta: 1 },
  { categoria: "ciencia", dificultad: "medio", pregunta: "¿Qué animal mamífero pone huevos?", opciones: ["Ornitorrinco", "Murciélago", "Canguro", "Delfín"], correcta: 0 },

  // ===== DEPORTES =====
  { categoria: "deportes", dificultad: "facil", pregunta: "¿Cuántos jugadores hay en un equipo de fútbol en cancha?", opciones: ["9", "10", "11", "12"], correcta: 2 },
  { categoria: "deportes", dificultad: "facil", pregunta: "¿En qué deporte se usa una raqueta y una pelota amarilla?", opciones: ["Bádminton", "Tenis", "Squash", "Ping-pong"], correcta: 1 },
  { categoria: "deportes", dificultad: "medio", pregunta: "¿Cada cuántos años se celebran los Juegos Olímpicos?", opciones: ["2", "3", "4", "5"], correcta: 2 },
  { categoria: "deportes", dificultad: "medio", pregunta: "¿Qué país ganó el Mundial de fútbol de 2022?", opciones: ["Francia", "Brasil", "Argentina", "Alemania"], correcta: 2 },
  { categoria: "deportes", dificultad: "medio", pregunta: "¿En qué deporte destaca Michael Jordan?", opciones: ["Béisbol", "Baloncesto", "Fútbol americano", "Hockey"], correcta: 1 },
  { categoria: "deportes", dificultad: "dificil", pregunta: "¿Cuál es la distancia oficial de un maratón?", opciones: ["42,195 km", "40 km", "45 km", "50 km"], correcta: 0 },
  { categoria: "deportes", dificultad: "dificil", pregunta: "¿En qué año se jugó el primer Mundial de fútbol?", opciones: ["1930", "1934", "1928", "1942"], correcta: 0 },
  { categoria: "deportes", dificultad: "facil", pregunta: "¿En qué deporte se hace un 'home run'?", opciones: ["Cricket", "Béisbol", "Golf", "Tenis"], correcta: 1 },
  { categoria: "deportes", dificultad: "medio", pregunta: "¿Cuántos sets se necesitan para ganar un Grand Slam (masculino)?", opciones: ["2", "3", "4", "5"], correcta: 1 },
  { categoria: "deportes", dificultad: "medio", pregunta: "¿Qué tenista tiene más Grand Slams masculinos hasta 2024?", opciones: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"], correcta: 2 },

  // ===== ARTE Y LITERATURA =====
  { categoria: "arte", dificultad: "facil", pregunta: "¿Quién escribió 'Don Quijote de la Mancha'?", opciones: ["Lope de Vega", "Miguel de Cervantes", "Federico García Lorca", "Pablo Neruda"], correcta: 1 },
  { categoria: "arte", dificultad: "facil", pregunta: "¿Quién pintó 'La noche estrellada'?", opciones: ["Van Gogh", "Monet", "Picasso", "Dalí"], correcta: 0 },
  { categoria: "arte", dificultad: "medio", pregunta: "¿Qué autor escribió 'Cien años de soledad'?", opciones: ["Mario Vargas Llosa", "Gabriel García Márquez", "Jorge Luis Borges", "Julio Cortázar"], correcta: 1 },
  { categoria: "arte", dificultad: "medio", pregunta: "¿Cuál es el museo más famoso de París?", opciones: ["Prado", "Louvre", "Reina Sofía", "Hermitage"], correcta: 1 },
  { categoria: "arte", dificultad: "dificil", pregunta: "¿En qué siglo vivió Shakespeare?", opciones: ["XV", "XVI-XVII", "XVIII", "XIX"], correcta: 1 },
  { categoria: "arte", dificultad: "dificil", pregunta: "¿Quién escribió 'La Odisea'?", opciones: ["Sófocles", "Virgilio", "Homero", "Esquilo"], correcta: 2 },
  { categoria: "arte", dificultad: "medio", pregunta: "¿De qué nacionalidad era Pablo Picasso?", opciones: ["Francesa", "Italiana", "Española", "Portuguesa"], correcta: 2 },
  { categoria: "arte", dificultad: "facil", pregunta: "¿Quién escribió 'Romeo y Julieta'?", opciones: ["Cervantes", "Shakespeare", "Molière", "Goethe"], correcta: 1 },

  // ===== MÚSICA =====
  { categoria: "musica", dificultad: "facil", pregunta: "¿Cuántas cuerdas tiene una guitarra clásica?", opciones: ["4", "5", "6", "7"], correcta: 2 },
  { categoria: "musica", dificultad: "facil", pregunta: "¿De qué país son los Beatles?", opciones: ["Estados Unidos", "Reino Unido", "Australia", "Canadá"], correcta: 1 },
  { categoria: "musica", dificultad: "medio", pregunta: "¿Quién compuso la 'Novena Sinfonía'?", opciones: ["Mozart", "Beethoven", "Bach", "Chopin"], correcta: 1 },
  { categoria: "musica", dificultad: "medio", pregunta: "¿Qué cantante es conocido como el 'Rey del Pop'?", opciones: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], correcta: 1 },
  { categoria: "musica", dificultad: "dificil", pregunta: "¿Cuál es el instrumento de viento más agudo de la orquesta?", opciones: ["Flauta", "Clarinete", "Oboe", "Piccolo"], correcta: 3 },
  { categoria: "musica", dificultad: "facil", pregunta: "¿Quién canta 'Despacito'?", opciones: ["Maluma", "Luis Fonsi", "J Balvin", "Bad Bunny"], correcta: 1 },
  { categoria: "musica", dificultad: "medio", pregunta: "¿Cuál es la canción más reproducida en Spotify históricamente (2023)?", opciones: ["Shape of You", "Despacito", "Blinding Lights", "Someone Like You"], correcta: 2 },
  { categoria: "musica", dificultad: "dificil", pregunta: "¿En qué año murió Freddie Mercury?", opciones: ["1989", "1990", "1991", "1992"], correcta: 2 },

  // ===== CINE Y TV =====
  { categoria: "cine", dificultad: "facil", pregunta: "¿Quién dirigió 'Titanic'?", opciones: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Ridley Scott"], correcta: 1 },
  { categoria: "cine", dificultad: "facil", pregunta: "¿En qué película aparece el personaje 'Jack Sparrow'?", opciones: ["El señor de los anillos", "Piratas del Caribe", "El hobbit", "Indiana Jones"], correcta: 1 },
  { categoria: "cine", dificultad: "medio", pregunta: "¿Qué actor interpreta a Iron Man?", opciones: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correcta: 1 },
  { categoria: "cine", dificultad: "medio", pregunta: "¿Cuántas películas de la saga Star Wars hay en la trilogía original?", opciones: ["2", "3", "4", "5"], correcta: 1 },
  { categoria: "cine", dificultad: "dificil", pregunta: "¿En qué año se estrenó la primera película de Toy Story?", opciones: ["1993", "1995", "1997", "1999"], correcta: 1 },
  { categoria: "cine", dificultad: "facil", pregunta: "¿Cómo se llama la escuela de magia de Harry Potter?", opciones: ["Beauxbatons", "Hogwarts", "Durmstrang", "Ilvermorny"], correcta: 1 },
  { categoria: "cine", dificultad: "medio", pregunta: "¿Qué serie protagoniza Walter White?", opciones: ["The Wire", "Breaking Bad", "Better Call Saul", "Ozark"], correcta: 1 },
  { categoria: "cine", dificultad: "dificil", pregunta: "¿Quién ganó el Óscar a mejor director por 'Parásitos'?", opciones: ["Bong Joon-ho", "Alfonso Cuarón", "Damien Chazelle", "Guillermo del Toro"], correcta: 0 },

  // ===== TECNOLOGÍA =====
  { categoria: "tecnologia", dificultad: "facil", pregunta: "¿Quién fundó Microsoft?", opciones: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Elon Musk"], correcta: 2 },
  { categoria: "tecnologia", dificultad: "facil", pregunta: "¿Qué significa 'WWW'?", opciones: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], correcta: 0 },
  { categoria: "tecnologia", dificultad: "medio", pregunta: "¿En qué año se fundó Google?", opciones: ["1995", "1996", "1998", "2001"], correcta: 2 },
  { categoria: "tecnologia", dificultad: "medio", pregunta: "¿Quién es el creador de Linux?", opciones: ["Richard Stallman", "Linus Torvalds", "Bill Joy", "Ken Thompson"], correcta: 1 },
  { categoria: "tecnologia", dificultad: "dificil", pregunta: "¿Qué significa HTTP?", opciones: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transit Path", "Hyper Tech Transfer Process"], correcta: 0 },
  { categoria: "tecnologia", dificultad: "facil", pregunta: "¿Qué empresa creó el iPhone?", opciones: ["Samsung", "Apple", "Nokia", "Sony"], correcta: 1 },
  { categoria: "tecnologia", dificultad: "medio", pregunta: "¿Qué lenguaje se usa principalmente en la web del lado del cliente?", opciones: ["Python", "Java", "JavaScript", "C++"], correcta: 2 },
  { categoria: "tecnologia", dificultad: "dificil", pregunta: "¿Quién fundó Tesla?", opciones: ["Elon Musk", "Martin Eberhard y Marc Tarpenning", "Jeff Bezos", "Larry Page"], correcta: 1 },
  { categoria: "tecnologia", dificultad: "medio", pregunta: "¿Cuál es la red social más antigua de las siguientes?", opciones: ["Instagram", "Twitter", "Facebook", "TikTok"], correcta: 2 },
  { categoria: "tecnologia", dificultad: "facil", pregunta: "¿Qué red social tiene como logo un pájaro azul (antes de su rebranding a X)?", opciones: ["LinkedIn", "Twitter", "Snapchat", "Discord"], correcta: 1 },
];
