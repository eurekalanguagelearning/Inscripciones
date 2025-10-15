document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el formulario
    const form = document.querySelector('form');

    // 2. Definir una función de limpieza (sanitización)
    function sanitizeInput(value) {
        if (typeof value !== 'string') {
            return value;
        }
        
        
        // Elimina tags HTML (<, >), comillas dobles/simples y backticks
        return value.replace(/<|>/g, '') 
                    .replace(/"|`/g, '');
    }
    
    // 3. Función de validación de patrones (detección de scripts)
    function containsInjectionPattern(value) {
        if (typeof value !== 'string') {
            return false;
        }
        
        // Patrón para detectar intentos de script o manejo de eventos peligrosos
        // ej: <script, onerror, javascript:
        const injectionPattern = /<script|onerror|onload|javascript:|eval\(/i;
        return injectionPattern.test(value);
    }


    form.addEventListener('submit', (event) => {
        let isSafe = true;
        const formElements = form.elements;

        // Itera sobre todos los elementos del formulario (input, textarea, etc.)
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];

            // Solo procesa campos de texto (text, email, password)
            if (['text', 'email', 'textarea'].includes(element.type.toLowerCase())) {
                let currentValue = element.value;
                
                // Paso A: DETECCIÓN de inyección peligrosa
                if (containsInjectionPattern(currentValue)) {
                    isSafe = false;
                    alert(`¡Error de seguridad! Por favor, elimina caracteres o patrones sospechosos del campo ${element.name}.`);
                    element.focus();
                    event.preventDefault(); // Detiene el envío
                    return;
                }
                
                // Paso B: SANITIZACIÓN (Limpieza) de datos
                // Limpia el valor antes de que se envíe
                element.value = sanitizeInput(currentValue);
            }
        }

        if (!isSafe) {
            // Si ya se detectó un patrón peligroso, la alerta ya se mostró y el envío se previno.
            return;
        }

        
    });
});