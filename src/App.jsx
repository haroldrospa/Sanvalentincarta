import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import coupleImage from './assets/couple.jpg';

const phrases = [
  "Desde que llegaste a mi vida, todo tiene más color. No solo eres mi novio, eres mi mejor amigo, mi cómplice y mi paz. Gracias por cada risa, por cada abrazo que reinicia mi mundo y por amarme tal como soy. Te amo más de lo que imaginas.",
  "A veces me detengo a pensar en la inmensa suerte que tengo de haberte encontrado. En un mundo con millones de personas, tú eres mi elección cada día. Gracias por construir conmigo este amor tan bonito, sano y lleno de magia.",
  "Hoy quiero recordarte lo increíble que eres. Tu bondad, tu esfuerzo y esa forma tan única que tienes de ver la vida me inspiran a ser mejor persona. No importa lo que pase, siempre estaré a tu lado, sosteniendo tu mano.",
  "No necesito un día especial para decirte que te amo, pero hoy aprovecho para recordártelo con más fuerza. Eres mi refugio seguro, mi lugar favorito y la razón de mis sonrisas más sinceras. Mi corazón es tuyo, hoy y siempre.",
  "Contigo he aprendido que el amor no es solo un sentimiento, es una elección diaria. Y yo te elijo a ti, con tus virtudes y tus manías, en los días buenos y en los que no tan buenos. Eres el mejor regalo que me ha dado la vida."
];

import ScratchCard from './ScratchCard';

export default function App() {
  // Estados: 'closed', 'opening', 'open'
  const [isScratched, setIsScratched] = useState(false);
  const [status, setStatus] = useState('closed');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [animateQuote, setAnimateQuote] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [explosionHearts, setExplosionHearts] = useState([]);

  // Generador de corazones flotantes (Fondo más denso)
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random();
      const left = Math.random() * 100;
      const size = Math.random() * 25 + 10; // Variación de tamaño
      const duration = Math.random() * 6 + 4;
      const delay = Math.random() * 2;
      const opacity = Math.random() * 0.5 + 0.3;

      setHearts(prev => [...prev, { id, left, size, duration, delay, opacity }].slice(-50)); // Más corazones en pantalla
    }, 400); // Frecuencia más alta
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    if (status !== 'closed') return;

    setStatus('opening');

    // Disparar explosión masiva de corazones
    const newExplosionHearts = [];
    for (let i = 0; i < 120; i++) { // ¡Muchos más corazones!
      const id = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 400 + 100; // Velocidad variable
      const size = Math.random() * 40 + 10;
      const duration = Math.random() * 1.5 + 1;
      const delay = Math.random() * 0.5;

      // Calcular destino final
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;

      newExplosionHearts.push({ id, x, y, size, duration, delay });
    }
    setExplosionHearts(newExplosionHearts);

    // Transición de animación: Abrir sobre -> Mostrar carta completa
    setTimeout(() => {
      setStatus('open');
    }, 1500);

    // Limpiar explosión
    setTimeout(() => {
      setExplosionHearts([]);
    }, 2500);
  };

  const nextQuote = () => {
    setAnimateQuote(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % phrases.length);
      setAnimateQuote(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black text-slate-800 font-sans perspective-1000">
      {/* Estilos CSS Avanzados */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;600&display=swap');
                
                .font-handwriting { font-family: 'Great Vibes', cursive; }
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Poppins', sans-serif; }
                
                /* Fondo animado */
                @keyframes floatUp {
                    0% { transform: translateY(110vh) scale(0.5) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-10vh) scale(1.2) rotate(360deg); opacity: 0; }
                }

                /* Explosión */
                @keyframes explode {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
                }

                /* Sobre 3D */
                .envelope-container {
                    perspective: 1000px;
                    transition: transform 0.5s ease;
                }
                
                .envelope {
                    position: relative;
                    width: 300px;
                    height: 200px;
                    background: #ff4d6d;
                    border-radius: 0 0 10px 10px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    z-index: 10;
                }

                .envelope::before { /* Solapa Izquierda */
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-left: 150px solid #ff758f;
                    border-top: 100px solid transparent;
                    border-bottom: 100px solid transparent;
                    z-index: 3;
                }
                
                .envelope::after { /* Solapa Derecha */
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-right: 150px solid #ff758f;
                    border-top: 100px solid transparent;
                    border-bottom: 100px solid transparent;
                    z-index: 3;
                }

                .envelope-bottom { /* Triángulo inferior visual */
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-left: 150px solid transparent;
                    border-right: 150px solid transparent;
                    border-bottom: 110px solid #ff5d7d;
                    border-radius: 0 0 10px 10px;
                    z-index: 4;
                }

                .flap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-left: 150px solid transparent;
                    border-right: 150px solid transparent;
                    border-top: 110px solid #ff8fa3;
                    transform-origin: top;
                    transition: transform 0.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.2s 0.4s;
                    z-index: 5;
                }

                .flap.open {
                    transform: rotateX(180deg);
                    z-index: 1;
                }

                .letter-preview {
                    position: absolute;
                    bottom: 0;
                    width: 90%;
                    height: 90%;
                    background: #fffdf0;
                    border-radius: 5px;
                    transition: transform 0.8s 0.6s ease-out;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
                }

                .letter-preview.slide-out {
                    transform: translateY(-150px);
                }

                /* Sello de Lacre */
                .seal {
                    position: absolute;
                    top: 100px; /* En el pico del flap */
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    background: #990a1f;
                    border-radius: 50%;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    z-index: 6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #b31229;
                    transition: opacity 0.3s;
                    cursor: pointer;
                }
                
                .seal.broken {
                    opacity: 0;
                    pointer-events: none;
                }

                /* Carta Final (Papel Real) */
                .paper-texture {
                    background-color: #fffdf0;
                    background-image: 
                        linear-gradient(#eee 1px, transparent 1px),
                        radial-gradient(#dbc6a0 0.5px, transparent 0.5px);
                    background-size: 100% 30px, 20px 20px;
                    box-shadow: 0 0 50px rgba(0,0,0,0.5), inset 0 0 60px rgba(189, 149, 109, 0.1);
                    border: 1px solid #e6dace;
                }

                .animate-zoomIn {
                    animation: zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.8) translateY(50px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .pulse-glow {
                    animation: pulseGlow 2s infinite;
                }
                
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(255, 77, 109, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(255, 77, 109, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 77, 109, 0); }
                }
            `}</style>

      {/* Fondo de Corazones */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-gray-900 via-rose-950 to-black">
        {hearts.map(h => (
          <div
            key={h.id}
            className="absolute text-rose-500 blur-[0.5px]"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              bottom: '-10%',
              opacity: h.opacity,
              animation: `floatUp ${h.duration}s linear infinite`,
              animationDelay: `${h.delay}s`
            }}
          >
            ❤️
          </div>
        ))}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Explosión FX */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-visible z-[100]">
        {explosionHearts.map(h => (
          <div
            key={h.id}
            className="absolute"
            style={{
              fontSize: `${h.size}px`,
              '--tx': `${h.x}px`,
              '--ty': `${h.y}px`,
              color: ['#ff0000', '#ff4d6d', '#ff758f', '#fff0f3'][Math.floor(Math.random() * 4)],
              animation: `explode ${h.duration}s ease-out forwards`,
              animationDelay: `${h.delay}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* CONTENEDOR PRINCIPAL */}

      {/* ESTADO 1 & 2: EL SOBRE (Cerrado o Abriéndose) */}
      {status !== 'open' && (
        <div
          className={`envelope-container cursor-pointer ${status === 'opening' ? 'pointer-events-none' : ''}`}
          onClick={handleOpen}
        >
          <div className="relative group">
            {/* Brillo pulsante alrededor del sobre */}
            <div className={`absolute inset-0 bg-rose-500 blur-xl opacity-20 transition-opacity duration-300 rounded-full ${status === 'closed' ? 'pulse-glow' : 'opacity-0'}`}></div>

            <div className="envelope">
              {/* La Carta Adentro (Preview) */}
              <div className={`letter-preview ${status === 'opening' ? 'slide-out' : ''}`}>
                <div className="text-[10px] text-slate-400 font-serif p-2">
                  Para: El amor de mi vida...
                </div>
              </div>

              {/* Solapa Superior (Móvil) */}
              <div className={`flap ${status === 'opening' ? 'open' : ''}`}></div>

              {/* Solapa Inferior (Fija) */}
              <div className="envelope-bottom"></div>

              {/* Sello de Lacre */}
              <div className={`seal ${status === 'opening' ? 'broken' : ''}`}>
                <Heart size={20} fill="#ffb3c1" stroke="none" />
              </div>
            </div>

            {/* Texto de instrucción */}
            <div className={`mt-12 text-center transition-opacity duration-500 ${status === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
              <p className="text-rose-300 font-handwriting text-3xl animate-pulse">Una carta para ti</p>
              <p className="text-xs text-rose-500/60 uppercase tracking-[0.2em] mt-2">Toca el sello</p>
            </div>
          </div>
        </div>
      )}

      {/* ESTADO 3: LA CARTA ABIERTA (Papel Real) */}
      {status === 'open' && (
        <div className="z-20 w-full max-w-lg p-4 animate-zoomIn perspective-1000">
          <div className="paper-texture rounded-sm p-6 md:p-12 relative rotate-1 shadow-2xl transform transition-transform duration-300 hover:rotate-0">

            {/* Decoraciones en el papel */}
            <div className="absolute top-0 right-0 p-2 md:p-4 opacity-10 pointer-events-none">
              <Sparkles size={60} className="text-rose-900 md:w-24 md:h-24" />
            </div>

            {/* Encabezado */}
            <div className="mb-4 md:mb-6 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center mb-2 md:mb-4 border border-rose-200">
                <Heart size={24} className="text-rose-600 md:w-8 md:h-8" fill="#e11d48" />
              </div>
              <h2 className="text-4xl md:text-5xl font-handwriting text-rose-800 mb-1 leading-tight text-center">
                Amor Mío
              </h2>
              <div className="h-[1px] w-16 md:w-24 bg-rose-300 my-2"></div>
              <h3 className="text-[10px] md:text-xs font-serif text-rose-900/60 uppercase tracking-widest">
                14 de Febrero
              </h3>
            </div>

            {/* Foto de la Pareja en Marco */}
            <div className="mb-6 mx-auto w-48 h-64 md:w-56 md:h-72 bg-white p-2 md:p-3 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 relative border border-gray-200">
              {/* Pin / Cinta adhesiva (Visual) */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-rose-400 shadow-sm border border-rose-500 z-10"></div>

              <div className="w-full h-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {/* 
                    IMPORTANTE: Reemplaza '/src/assets/couple.jpg' con la imagen real de la pareja.
                    Si no tienes la imagen en assets, guárdala allí con el nombre 'couple.jpg'
                 */}
                <img
                  src={coupleImage}
                  alt="Nosotros"
                  className="w-full h-full object-cover filter sepia-[0.2] contrast-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x600/ffe4e6/9f1239?text=Tu+Foto+Aqui';
                  }}
                />
              </div>
            </div>

            {/* Contenido de Texto */}
            <div className="w-full mb-6 md:mb-8 min-h-[150px] md:min-h-[180px] flex items-center justify-center relative">
              <div className={`transition-all duration-500 transform ${animateQuote ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <p className="text-lg md:text-2xl text-slate-800 font-handwriting leading-relaxed text-center px-1 md:px-2">
                  "{phrases[quoteIndex]}"
                </p>
              </div>
            </div>

            {/* Botón */}
            <div className="flex justify-center mt-2 md:mt-4">
              <button
                onClick={nextQuote}
                className="group relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm font-serif text-rose-900 transition-all duration-200 border border-rose-300 rounded hover:bg-rose-50 hover:border-rose-400 focus:outline-none active:scale-95"
              >
                <span className="mr-2 uppercase tracking-wide text-[10px] md:text-xs">Leer más</span>
                <RefreshCw size={12} className="transition-transform duration-500 group-hover:rotate-180 text-rose-400 md:w-3.5 md:h-3.5" />
              </button>
            </div>

            {/* Pie de página */}
            <div className="mt-8 md:mt-12 text-center">
              <p className="font-handwriting text-lg md:text-xl text-slate-500">Siempre tuya,</p>
              <div className="text-xs text-rose-300 mt-1">❤</div>
            </div>
          </div>
        </div>
      )}

      {/* CAPA DE RASPADO INICIAL */}
      {!isScratched && (
        <ScratchCard onComplete={() => setIsScratched(true)} />
      )}
    </div>
  );
}
