let currentQuestion = 0; // Índice de la pregunta actual
const totalQuestions = 10; // Total de preguntas

// Mostrar la primera pregunta al cargar
document.addEventListener('DOMContentLoaded', () => {
    showQuestion(currentQuestion);
    document.getElementById('navigation-buttons').style.display = 'block'; // Mostrar botones de navegación desde el inicio
    document.getElementById('nextBtn').style.display = 'none'; // Ocultar el botón "Siguiente" en la página de inicio

    // Seleccionar todos los textareas y añadir el evento input
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResize);
    });
});

// Función para ajustar la altura del textarea automáticamente
function autoResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

// Mostrar pregunta actual
function showQuestion(index) {
    const questions = document.querySelectorAll('.question');
    questions.forEach((question, i) => {
        question.style.display = i === index ? 'block' : 'none'; // Mostrar solo la pregunta actual
    });

    // Mostrar/ocultar botones de navegación
    document.getElementById('prevBtn').style.display = index === 0 ? 'none' : 'inline';
    document.getElementById('nextBtn').style.display = index === totalQuestions - 1 ? 'none' : 'inline';
    document.getElementById('finishBtn').style.display = index === totalQuestions - 1 ? 'inline' : 'none';
}

// Validar respuesta y cambiar pregunta
function changeQuestion(direction) {
    let answer = '';
    const currentElement = document.getElementById(`answer${currentQuestion + 1}`);
    
    if (currentElement) {
        if (currentElement.tagName.toLowerCase() === 'textarea' || currentElement.tagName.toLowerCase() === 'input') {
            answer = currentElement.value.trim();
        } else if (currentElement.tagName.toLowerCase() === 'div') {
            const selectedOption = document.querySelector(`input[name="answer${currentQuestion + 1}"]:checked`);
            answer = selectedOption ? selectedOption.value : '';
        }
    }

    // Validar respuesta antes de avanzar
    if (direction === 1 && answer === '') {
        alert(`Por favor, completa la respuesta ${currentQuestion + 1}. No puedes dejar este espacio en blanco.`);
        return; // Detener si no hay respuesta
    }

    // Cambiar índice de pregunta
    currentQuestion += direction;

    // Limitar el índice de preguntas
    if (currentQuestion < 0) currentQuestion = 0;
    if (currentQuestion >= totalQuestions) {
        finishForm(); // Ir a la página final si se ha llegado al final
        return;
    }

    showQuestion(currentQuestion);
    playSound(); // Reproducir sonido después de cambiar la pregunta
}




// Prompt base con espacios para las respuestas
const basePrompt = `
    Eres un psicólogo virtual, y una persona ha respondido a un cuestionario sobre su relación con el mundo digital. A partir de sus respuestas, genera un análisis breve en un solo párrafo que resuma sus patrones, preocupaciones y aspiraciones, sin citar literalmente las respuestas de la persona ni utilizarlas textualmente entre comillas. Si mencionas algún aspecto, hazlo de manera interpretativa. Además, enfoca el análisis de manera positiva, resaltando los puntos fuertes o enfoques constructivos en las respuestas.

Instrucciones:

El inicio del análisis debe ser cercano con la persona, utilizando la siguiente estructura:
"Gracias por permitirme acompañarte en este viaje. Tu relación con la tecnología refleja [Análisis]."
Realiza un análisis breve de las respuestas en un párrafo, destacando los principales temas y emociones.
Termina con una frase motivacional inspirada en los temas y aspiraciones expresados.
No cites literalmente las respuestas ni las uses textualmente entre comillas.
Incluye los apartados "Análisis según las respuestas proporcionadas" y "Frase Motivadora".
Respuestas:
    1. Describe tu relación con la tecnología usando solo tres palabras: {respuesta1}.
    2. ¿Qué es lo que más te inspira o preocupa sobre cómo el mundo se está digitalizando? {respuesta2}.
    3. Escribe una frase o pensamiento que exprese cómo te sientes en el mundo digital: {respuesta3}.
    4. ¿Qué emoción describe mejor tu experiencia en internet? {respuesta4}.
    5. ¿Con qué frecuencia piensas en la privacidad de tus datos personales? {respuesta5}.
    6. ¿Cómo sueles relacionarte en las redes sociales? {respuesta6}.
    7. Elige la imagen que mejor representa cómo te sientes hoy: {respuesta7}.
    8. Elige la imagen que mejor describe cómo percibes el mundo digital: {respuesta8}.
    9. ¿Qué esperas que la tecnología traiga al futuro de las personas? {respuesta9}.
    10. ¿Qué palabra describe mejor lo que quieres reflejar en tus interacciones en línea? {respuesta10}.
    Formato de Respuesta:

Análisis según las respuestas proporcionadas:
Gracias por permitirme acompañarte en este viaje. Tu relación con la tecnología refleja [Análisis Interpretativo basado en las respuestas].

Frase Motivadora:
[Frase inspiracional acorde a los temas y aspiraciones].
`;

// Función para generar el prompt final con respuestas
function generatePrompt() {
    const answers = Array.from({length: totalQuestions}, (_, i) => {
        const element = document.getElementById(`answer${i + 1}`);
        if (element) {
            if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
                return element.value.trim();
            } else if (element.tagName.toLowerCase() === 'div') {
                const selectedOption = document.querySelector(`input[name="answer${i + 1}"]:checked`);
                return selectedOption ? selectedOption.value : '';
            }
        }
        return '';
    });

    // Validar si hay campos vacíos
    const emptyAnswerIndex = answers.findIndex(answer => answer === '');
    if (emptyAnswerIndex !== -1) {
        alert(`Por favor, completa la respuesta ${emptyAnswerIndex + 1}. No puedes dejar este espacio en blanco.`);
        return null; // Salir de la función si hay un campo vacío
    }

    // Rellenar el prompt con las respuestas
    return basePrompt.replace(/{respuesta(\d+)}/g, (_, index) => answers[index - 1]);
}

// Función para copiar el prompt al portapapeles
function copyPrompt() {
    const prompt = generatePrompt();
    if (!prompt) return; // Detener si no se generó el prompt

    const textarea = document.createElement('textarea');
    textarea.value = prompt;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Prompt copiado al portapapeles!');
}

// Función para iniciar el formulario
function startForm() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('form').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'inline'; // Mostrar el botón "Siguiente" después de iniciar el formulario
    showQuestion(currentQuestion);
}


// Función para enviar el prompt a la IA y obtener la respuesta
async function sendPromptToAI() {
    const prompt = generatePrompt();
    if (!prompt) return; // Detener si no se generó el prompt

    document.getElementById('loading-message').style.display = 'block'; // Mostrar mensaje de carga

    const model = window.genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let analysisText = await response.text();

        // Eliminar el encabezado del análisis
        analysisText = analysisText.replace("Análisis según las respuestas proporcionadas:", "").trim();

        document.getElementById('ai-response').innerText = analysisText;
        document.getElementById('ai-response-container').style.display = 'block';

        // Verificar si la voz está activada antes de llamar a speak
        var voiceCheckbox = document.getElementById('voiceCheckbox');
        if (voiceCheckbox.checked) {
            // Llamar a la función speak para leer el análisis
            speak(analysisText);

            // Añadir la frase final después de un pequeño retraso para asegurar que el análisis se lea completamente
            setTimeout(function() {
                speak("Espero que esta experiencia te haya inspirado a reflexionar sobre tu identidad digital.");
            }, analysisText.length * 50); // Ajustar el tiempo según la longitud del texto
        }
    } catch (error) {
        console.error('Error al generar contenido:', error);
        if (error.message.includes('The model is overloaded')) {
            alert('El modelo está sobrecargado. Por favor, intenta nuevamente más tarde.');
        } else {
            alert('Ocurrió un error al generar el contenido. Por favor, intenta nuevamente.');
        }
        document.getElementById('fallback-container').style.display = 'block';
    } finally {
        document.getElementById('loading-message').style.display = 'none'; // Ocultar mensaje de carga
    }
}

// Función para finalizar el formulario y mostrar la página final
function finishForm() {
    document.getElementById('form').style.display = 'none';
    document.getElementById('end-page').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'none';
}

// Función para reiniciar el formulario
function restartForm() {
    // Reiniciar las respuestas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
        textarea.style.height = 'auto'; // Reiniciar altura
    });
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });

    // Ocultar la página final y mostrar la página de inicio
    document.getElementById('end-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    document.getElementById('ai-response-container').style.display = 'none';
    document.getElementById('fallback-container').style.display = 'none'; // Ocultar el contenedor de fallback

    // Mostrar el apartado de opciones inmersivas
    document.getElementById('immersive-options').style.display = 'block';

    // Reiniciar el estado de los checkboxes
    document.getElementById('musicCheckbox').checked = false;
    document.getElementById('voiceCheckbox').checked = false;

    // Reiniciar el índice de preguntas
    currentQuestion = 0;
    showQuestion(currentQuestion);
}




function speak(text) {
    var msg = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices.find(voice => voice.name === 'Google español de América Latina' || voice.name === 'Google US Spanish Female') || voices[0]; // Cambiar a una voz femenina
    window.speechSynthesis.speak(msg);
}

var introText = "Hola, mi nombre es PsicoNet. Hoy te acompañaré en un viaje inmersivo de autodescubrimiento digital. Responde estas preguntas y juntos exploraremos cómo te percibes en el mundo tecnológico.";


document.getElementById('musicVolume').addEventListener('input', function() {
    var audio = document.getElementById('introAudio');
    audio.volume = this.value;
});

document.getElementById('muteMusic').addEventListener('click', function() {
    var audio = document.getElementById('introAudio');
    audio.muted = !audio.muted;
    this.textContent = audio.muted ? 'Musica: Desactivada' : 'Musica: Activada';
});

async function sendPromptToAI() {
    const prompt = generatePrompt();
    if (!prompt) return; // Detener si no se generó el prompt

    document.getElementById('loading-message').style.display = 'block'; // Mostrar mensaje de carga

    const model = window.genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let analysisText = await response.text();

        // Eliminar el encabezado del análisis
        analysisText = analysisText.replace("Análisis según las respuestas proporcionadas:", "").trim();

        document.getElementById('ai-response').innerText = analysisText;
        document.getElementById('ai-response-container').style.display = 'block';

        // Verificar si la voz está activada antes de llamar a speak
        var voiceCheckbox = document.getElementById('voiceCheckbox');
        if (voiceCheckbox.checked) {
            // Llamar a la función speak para leer el análisis
            speak(analysisText);

            // Añadir la frase final después de un pequeño retraso para asegurar que el análisis se lea completamente
            setTimeout(function() {
                speak("Espero que esta experiencia te haya inspirado a reflexionar sobre tu identidad digital.");
            }, analysisText.length * 50); // Ajustar el tiempo según la longitud del texto
        }
    } catch (error) {
        console.error('Error al generar contenido:', error);
        if (error.message.includes('The model is overloaded')) {
            alert('El modelo está sobrecargado. Por favor, intenta nuevamente más tarde.');
        } else {
            alert('Ocurrió un error al generar el contenido. Por favor, intenta nuevamente.');
        }
        document.getElementById('fallback-container').style.display = 'block';
    } finally {
        document.getElementById('loading-message').style.display = 'none'; // Ocultar mensaje de carga
    }
}

function finalizarCuestionario(analisis) {
    var finalText = "Gracias por permitirme acompañarte en este viaje. Tu relación con la tecnología refleja " + analisis + ". Espero que esta experiencia te haya inspirado a reflexionar sobre tu identidad digital.";
    speak(finalText);
}

function finishForm() {
    document.getElementById('form').style.display = 'none';
    document.getElementById('end-page').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'none';

    // Mostrar el cuadro de fallback
    document.getElementById('fallback-container').style.display = 'block';
}

function restartForm() {
    // Reiniciar las respuestas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
        textarea.style.height = 'auto'; // Reiniciar altura
    });
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });

    // Ocultar la página final y mostrar la página de inicio
    document.getElementById('end-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    document.getElementById('ai-response-container').style.display = 'none';
    document.getElementById('fallback-container').style.display = 'none'; // Ocultar el contenedor de fallback

    // Mostrar el apartado de opciones inmersivas
    document.getElementById('immersive-options').style.display = 'block';

    // Reiniciar el estado de los checkboxes
    document.getElementById('musicCheckbox').checked = false;
    document.getElementById('voiceCheckbox').checked = false;

    // Reiniciar el índice de preguntas
    currentQuestion = 0;
    showQuestion(currentQuestion);
}

function mostrarResultado(usuario, analisis) {
    var resultadoText = "Hola " + usuario + ", gracias por participar. Tu relación con la tecnología refleja " + analisis + ". Espero que esta experiencia te haya inspirado a reflexionar sobre tu identidad digital.";
    speak(resultadoText);
}

function startMusic() {
    var audio = document.getElementById('introAudio');
    audio.play();
}

function startVoice() {
    var introText = "Hola, mi nombre es PsicoNet. Hoy te acompañaré en un viaje inmersivo de autodescubrimiento digital. Responde estas preguntas y juntos exploraremos cómo te percibes en el mundo tecnológico.";
    speak(introText);
}

function toggleMusic() {
    var audio = document.getElementById('introAudio');
    var musicCheckbox = document.getElementById('musicCheckbox');
    if (musicCheckbox.checked) {
        audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0; // Reiniciar el audio
    }
}

function toggleVoice() {
    var voiceCheckbox = document.getElementById('voiceCheckbox');
    if (voiceCheckbox.checked) {
        var introText = "Hola, mi nombre es PsicoNet. Hoy te acompañaré en un viaje inmersivo de autodescubrimiento digital. Responde estas preguntas y juntos exploraremos cómo te percibes en el mundo tecnológico.";
        speak(introText);
    }
}
function startExperience() {
    // Ocultar el apartado de opciones inmersivas
    document.getElementById('immersive-options').style.display = 'none';

    // Mostrar el formulario y ocultar la página de inicio
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('form').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'block';

    // Llamar a la función startForm para inicializar el formulario
    startForm();
}


document.addEventListener('DOMContentLoaded', () => {
    function playSound() {
        var audio = new Audio('Recursos/CLick_Boton.wav');
        audio.play();
    }

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', playSound);
    });
});

function validateQuestion() {
    let answer = '';
    const currentElement = document.getElementById(`answer${currentQuestion + 1}`);
    
    if (currentElement) {
        if (currentElement.tagName.toLowerCase() === 'textarea' || currentElement.tagName.toLowerCase() === 'input') {
            answer = currentElement.value.trim();
        } else if (currentElement.tagName.toLowerCase() === 'div') {
            const selectedOption = document.querySelector(`input[name="answer${currentQuestion + 1}"]:checked`);
            answer = selectedOption ? selectedOption.value : '';
        }
    }

    // Validar respuesta antes de avanzar
    if (answer === '') {
        alert(`Por favor, completa la respuesta ${currentQuestion + 1}. No puedes dejar este espacio en blanco.`);
        return false; // Detener si no hay respuesta
    }

    return true; // Permitir avanzar si hay respuesta
}

// Funciones existentes para manejar el formulario