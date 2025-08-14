// RUTA: frontend/src/components/icons/HardwareIcon.jsx (NUEVO ARCHIVO)

import React from 'react';

// Este componente es un SVG en línea que nos permite un control total sobre el estilo y la animación.
// Acepta `className` para el dimensionamiento y el color, y `animationDuration` para la velocidad de las aspas.
const HardwareIcon = ({ className, animationDuration }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className} 
      fill="currentColor" // El color se heredará de la clase de texto (ej. text-text-tertiary)
    >
      {/* Marco exterior - estático */}
      <path 
        d="M85,100H15C6.7,100,0,93.3,0,85V15C0,6.7,6.7,0,15,0H85c8.3,0,15,6.7,15,15V85C100,93.3,93.3,100,85,100z"
        opacity="0.2" // Un gris más oscuro para el marco
      />
      {/* Marco interior - estático */}
      <path 
        d="M83.2,95H16.8c-6.5,0-11.8-5.3-11.8-11.8V16.8C5,10.3,10.3,5,16.8,5h66.3C89.7,5,95,10.3,95,16.8v66.3 C95,89.7,89.7,95,83.2,95z" 
        opacity="0.5" // Un gris medio
      />
      {/* Tornillos en las esquinas - estáticos */}
      <circle cx="15" cy="15" r="5" opacity="0.7" />
      <circle cx="85" cy="15" r="5" opacity="0.7" />
      <circle cx="15" cy="85" r="5" opacity="0.7" />
      <circle cx="85" cy="85" r="5" opacity="0.7" />

      {/* Grupo de Aspas - este es el elemento que rotará */}
      <g 
        className="fan-blades" // Clase para apuntar con CSS
        style={{ animationDuration: `${animationDuration}s` }}
        transform-origin="50 50" // Asegura que la rotación sea desde el centro
      >
        {/* Hub central */}
        <circle cx="50" cy="50" r="10" opacity="0.9" />
        {/* Aspas (creadas con paths) */}
        <path d="M50,50 L60,20 Q50,22 40,20 Z" opacity="0.7" />
        <path d="M50,50 L80,40 Q78,50 80,60 Z" opacity="0.7" />
        <path d="M50,50 L60,80 Q50,78 40,80 Z" opacity="0.7" />
        <path d="M50,50 L20,60 Q22,50 20,40 Z" opacity="0.7" />
        <path d="M50,50 L35,28 Q40,35 45,35 Z" transform="rotate(45 50 50)" opacity="0.7"/>
        <path d="M50,50 L35,28 Q40,35 45,35 Z" transform="rotate(135 50 50)" opacity="0.7"/>
        <path d="M50,50 L35,28 Q40,35 45,35 Z" transform="rotate(225 50 50)" opacity="0.7"/>
        <path d="M50,50 L35,28 Q40,35 45,35 Z" transform="rotate(315 50 50)" opacity="0.7"/>
      </g>
    </svg>
  );
};

export default HardwareIcon;