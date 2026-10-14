import React, { useState, useMemo } from 'react';

// --- DATOS INICIALES MOCK (PERSISTENTES EN MEMORIA) ---
const DOCENTE_PERFIL = {
  nombre: "Dr. Manuel Santos Rodríguez",
  grado: "Docente Principal T.C.",
  facultad: "Facultad de Derecho y Ciencias Políticas",
  departamento: "Departamento de Ciencia Política y Gobernanza",
  escuela: "Escuela Profesional de Ciencia Política",
  email: "msantos@unitru.edu.pe",
  codigo: "UNT-DOC-4092"
};

const INITIAL_SOLICITUDES = [
  {
    id: "UNT-CAP-2026-001",
    tipo: "Maestría",
    nombrePrograma: "Maestría en Ciencia Política y Gestión Pública",
    institucion: "Pontificia Universidad Católica del Perú (PUCP)",
    dirigidoA: "Rectorado",
    monto: 8500,
    modalidad: "Híbrida",
    fechaInicio: "2026-05-10",
    fechaFin: "2027-11-20",
    justificacion: "Fortalecer la línea de investigación en políticas públicas locales de la EP de Ciencia Política.",
    estado: "En Evaluación",
    fechaSolicitud: "2026-03-12"
  },
  {
    id: "UNT-CAP-2026-002",
    tipo: "Curso Especializado",
    nombrePrograma: "Curso de Especialización en Metodología de la Investigación Cualitativa",
    institucion: "Universidad Nacional Mayor de San Marcos",
    dirigidoA: "Facultad de Derecho y Ciencias Políticas",
    monto: 1800,
    modalidad: "Virtual",
    fechaInicio: "2026-06-01",
    fechaFin: "2026-07-15",
    justificacion: "Capacitación metodológica para asesoría de tesis de pregrado en derecho constitucional.",
    estado: "Aprobado",
    fechaSolicitud: "2026-02-20"
  },
  {
    id: "UNT-CAP-2026-003",
    tipo: "Diplomado",
    nombrePrograma: "Diplomado Internacional en Gobernanza Electoral y Democracia",
    institucion: "OEA / Flacso",
    dirigidoA: "Escuela de Ciencia Política",
    monto: 2400,
    modalidad: "Virtual",
    fechaInicio: "2026-07-01",
    fechaFin: "2026-09-30",
    justificacion: "Actualización teórica en sistemas electorales comparados.",
    estado: "Pendiente",
    fechaSolicitud: "2026-04-02"
  }
];

// Helper para generar fechas dinámicas relativas a hoy para el semáforo
const getFutureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const INITIAL_TESIS = [
  {
    id: "TES-2026-101",
    titulo: "Análisis de la gestión pública participativa y gobernabilidad en el Gobierno Regional de La Libertad (2020-2024)",
    estudiante: "Bach. Lourdes Patricia Alva Castillo",
    escuela: "Escuela Profesional de Ciencia Política",
    rol: "Asesor",
    fechaSustentacion: getFutureDate(5), // 5 días -> ROJO (<7 días)
    horaSustentacion: "10:00 AM",
    lugar: "Auditorio de la Facultad de Derecho",
    dictamenEmitido: false,
    agendaAcomodada: false
  },
  {
    id: "TES-2026-102",
    titulo: "La reforma constitucional del sistema de partidos políticos y su impacto en la estabilidad parlamentaria en el Perú",
    estudiante: "Bach. Carlos Eduardo Mendoza Varas",
    escuela: "Escuela Profesional de Ciencia Política",
    rol: "Revisor",
    fechaSustentacion: getFutureDate(12), // 12 días -> AMARILLO (8-15 días)
    horaSustentacion: "16:00 PM",
    lugar: "Sala A-204 Facultad de Derecho",
    dictamenEmitido: true,
    agendaAcomodada: false
  },
  {
    id: "TES-2026-103",
    titulo: "Eficacia de las medidas de protección a víctimas de violencia familiar en los juzgados de familia de Trujillo Metropolitano",
    estudiante: "Bach. Andrea Lucía Paredes Ríos",
    escuela: "Escuela Profesional de Derecho",
    rol: "Asesor",
    fechaSustentacion: getFutureDate(26), // 26 días -> VERDE (16-30 días)
    horaSustentacion: "11:30 AM",
    lugar: "Paraninfo Institucional UNT",
    dictamenEmitido: true,
    agendaAcomodada: true
  },
  {
    id: "TES-2026-104",
    titulo: "Transparencia y acceso a la información pública en los municipios distritales de la provincia de Trujillo",
    estudiante: "Bach. Jorge Luis Benites Torres",
    escuela: "Escuela Profesional de Ciencia Política",
    rol: "Revisor",
    fechaSustentacion: getFutureDate(4), // 4 días -> ROJO (<7 días)
    horaSustentacion: "09:00 AM",
    lugar: "Sala de Grados FDCP",
    dictamenEmitido: false,
    agendaAcomodada: false
  },
  {
    id: "TES-2026-105",
    titulo: "Digitalización de expedientes judiciales y celeridad procesal en la Corte Superior de Justicia de La Libertad",
    estudiante: "Bach. Fiorella María Sánchez Ruiz",
    escuela: "Escuela Profesional de Derecho",
    rol: "Asesor",
    fechaSustentacion: getFutureDate(35), // >30 días -> VERDE
    horaSustentacion: "15:00 PM",
    lugar: "Virtual - Plataforma MS Teams UNT",
    dictamenEmitido: false,
    agendaAcomodada: false
  }
];

const INITIAL_NOTIFICACIONES = [
  {
    id: "NOT-1",
    tipo: "urgente",
    titulo: "Sustentación inminente (4 días)",
    mensaje: "Sustentación de Bach. Jorge Luis Benites Torres (Revisor) programada para el " + getFutureDate(4) + ". Por favor verifique su agenda.",
    fecha: "Hoy 08:30 AM",
    leida: false,
    linkTab: "tesis"
  },
  {
    id: "NOT-2",
    tipo: "alerta",
    titulo: "Sustentación a 5 días",
    mensaje: "Sustentación de Bach. Lourdes Patricia Alva Castillo (Asesor). Recuerde coordinar aula y confirmación de jurados.",
    fecha: "Ayer 14:15 PM",
    leida: false,
    linkTab: "tesis"
  },
  {
    id: "NOT-3",
    tipo: "info",
    titulo: "Solicitud de Capacitación Aprobada",
    mensaje: "Su solicitud UNT-CAP-2026-002 (Curso de Investigación Cualitativa) ha sido aprobada por la Decanatura.",
    fecha: "Hace 2 días",
    leida: true,
    linkTab: "mis_solicitudes"
  }
];

// --- LOGO UNT SVG OFICIAL ---
const LogoUNT = ({ className = "h-14" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {/* Escudo / Emblem UNT */}
    <div className="relative flex items-center justify-center w-12 h-14 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-md shadow-md p-1 border border-amber-300 flex-shrink-0">
      <div className="w-full h-full bg-blue-950 rounded flex flex-col items-center justify-between p-1 text-center relative overflow-hidden">
        {/* Grifo Dorado & Escudo Central */}
        <svg viewBox="0 0 100 120" className="w-full h-full fill-current text-amber-400">
          <path d="M50 5 L65 25 L85 25 L70 45 L80 70 L50 60 L20 70 L30 45 L15 25 L35 25 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <rect x="35" y="50" width="30" height="40" rx="3" fill="#0B1D3A" stroke="#F59E0B" strokeWidth="2" />
          {/* Bandera / Escudo interno */}
          <rect x="40" y="55" width="20" height="30" fill="#DC2626" />
          <rect x="46" y="55" width="8" height="30" fill="#FFFFFF" />
          <circle cx="50" cy="70" r="4" fill="#F59E0B" />
          {/* Antorcha / Sol */}
          <path d="M50 15 L53 22 L47 22 Z" fill="#EF4444" />
        </svg>
        <span className="text-[7px] font-bold text-amber-300 tracking-tighter leading-none mt-0.1">1824</span>
      </div>
    </div>
    
    {/* Texto Tipográfico Oficial UNT */}
    <div className="flex flex-col text-white">
      <span className="text-[10px] md:text-xs tracking-widest font-semibold uppercase text-amber-300 opacity-95">
        Universidad Nacional de Trujillo
      </span>
      <span className="text-xl md:text-2xl font-black tracking-tight text-white leading-none font-serif">
        U N T
      </span>
      <span className="text-[9px] text-blue-200 tracking-wider uppercase font-light">
        Fundada por Simón Bolívar - 1824
      </span>
    </div>
  </div>
);

// --- HELPER FUNCIONAL PARA DÍAS RESTANTES Y CÁLCULO DE SEMÁFORO ---
const calcularSemaforo = (fechaSustentacion) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaTarget = new Date(fechaSustentacion + 'T00:00:00');
  
  const diferenciaMs = fechaTarget - hoy;
  const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  if (diasRestantes <= 7) {
    return {
      dias: diasRestantes,
      estado: "CRÍTICO",
      colorBg: "bg-red-500",
      colorText: "text-red-700",
      colorBadge: "bg-red-100 text-red-800 border-red-300",
      colorBarra: "from-red-500 to-rose-600",
      porcentajeBarra: Math.max(10, (diasRestantes / 30) * 100),
      alertaTexto: "Sustentación inminente (≤ 7 días). Ajustar horario de clases/asesorías.",
      nivel: "rojo"
    };
  } else if (diasRestantes <= 15) {
    return {
      dias: diasRestantes,
      estado: "ATENCIÓN",
      colorBg: "bg-amber-500",
      colorText: "text-amber-700",
      colorBadge: "bg-amber-100 text-amber-800 border-amber-300",
      colorBarra: "from-amber-400 to-yellow-500",
      porcentajeBarra: (diasRestantes / 30) * 100,
      alertaTexto: "Próxima sustentación (8-15 días). Revisar dictamen borrador.",
      nivel: "amarillo"
    };
  } else {
    return {
      dias: diasRestantes,
      estado: "REGULAR",
      colorBg: "bg-emerald-500",
      colorText: "text-emerald-700",
      colorBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      colorBarra: "from-emerald-400 to-teal-500",
      porcentajeBarra: Math.min(100, (diasRestantes / 30) * 100),
      alertaTexto: "Tiempo suficiente (> 15 días). Estado planificado.",
      nivel: "verde"
    };
  }
};

// --- COMPONENTE PRINCIPAL APP ---
export default function App() {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [solicitudes, setSolicitudes] = useState(INITIAL_SOLICITUDES);
  const [tesisLista, setTesisLista] = useState(INITIAL_TESIS);
  const [notificaciones, setNotificaciones] = useState(INITIAL_NOTIFICACIONES);
  const [mensajeToast, setMensajeToast] = useState(null);

  // Modales
  const [modalHorarioTesis, setModalHorarioTesis] = useState(null);
  const [modalDetalleTesis, setModalDetalleTesis] = useState(null);
  const [modalDetalleSolicitud, setModalDetalleSolicitud] = useState(null);

  // Mostrar mensaje emergente
  const showToast = (msg, tipo = "success") => {
    setMensajeToast({ text: msg, type: tipo });
    setTimeout(() => setMensajeToast(null), 4000);
  };

  // Conteo de notificaciones no leídas
  const unreadCount = useMemo(() => {
    return notificaciones.filter(n => !n.leida).length;
  }, [notificaciones]);

  // Marcar notificaciones como leídas
  const marcarTodasLeidas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    showToast("Todas las notificaciones han sido marcadas como leídas");
  };

  // Agregar nueva solicitud
  const handleCrearSolicitud = (nuevaSolicitud) => {
    const idGenerado = `UNT-CAP-2026-0${solicitudes.length + 10}`;
    const objCompleto = {
      ...nuevaSolicitud,
      id: idGenerado,
      estado: "Pendiente",
      fechaSolicitud: new Date().toISOString().split('T')[0]
    };
    setSolicitudes([objCompleto, ...solicitudes]);
    
    // Crear notificación automática
    const nuevaNotif = {
      id: `NOT-${Date.now()}`,
      tipo: "info",
      titulo: "Solicitud de Capacitación Registrada",
      mensaje: `Se ha generado el expediente ${idGenerado} dirigido a ${nuevaSolicitud.dirigidoA}.`,
      fecha: "Ahora",
      leida: false,
      linkTab: "mis_solicitudes"
    };
    setNotificaciones([nuevaNotif, ...notificaciones]);

    showToast(`¡Solicitud ${idGenerado} registrada con éxito!`, "success");
    setTabActiva('mis_solicitudes');
  };

  // Marcar horario como acomodado para tesis
  const handleAcomodarHorario = (idTesis, notas) => {
    setTesisLista(prev => prev.map(t => {
      if (t.id === idTesis) {
        return { ...t, agendaAcomodada: true, notasAgenda: notas };
      }
      return t;
    }));
    setModalHorarioTesis(null);
    showToast("Horario reservado y sincronizado con la agenda docente.", "success");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col selection:bg-amber-200">
      
      {/* TOAST DE NOTIFICACIÓN DE ACCIONES */}
      {mensajeToast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-amber-500/40 animate-bounce">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-sm font-medium">{mensajeToast.text}</span>
          <button onClick={() => setMensajeToast(null)} className="ml-3 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* HEADER / NAVBAR INSTITUCIONAL UNT */}
      <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white shadow-xl sticky top-0 z-40 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo y Nombre */}
            <div className="cursor-pointer" onClick={() => setTabActiva('dashboard')}>
              <LogoUNT />
            </div>

            {/* Perfil del Docente Logueado */}
            <div className="flex items-center gap-4 bg-blue-900/60 backdrop-blur border border-blue-700/50 rounded-xl p-2 px-3.5 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-blue-950 font-bold flex items-center justify-center text-lg shadow">
                MS
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-amber-300 leading-tight">{DOCENTE_PERFIL.nombre}</div>
                <div className="text-[11px] text-blue-200 leading-tight">{DOCENTE_PERFIL.facultad}</div>
                <div className="text-[10px] text-slate-300 italic">{DOCENTE_PERFIL.escuela}</div>
              </div>
            </div>

          </div>

          {/* Menú de Navegación por pestañas */}
          <nav className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-blue-800/80 pt-2 text-sm font-medium">
            <button
              onClick={() => setTabActiva('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                tabActiva === 'dashboard' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <span>📊</span> Dashboard
            </button>

            <button
              onClick={() => setTabActiva('capacitaciones')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                tabActiva === 'capacitaciones' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <span>🎓</span> Solicitud de Capacitación
            </button>

            <button
              onClick={() => setTabActiva('mis_solicitudes')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap relative ${
                tabActiva === 'mis_solicitudes' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <span>📄</span> Mis Solicitudes
              <span className="bg-blue-900 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-400/40 font-mono">
                {solicitudes.length}
              </span>
            </button>

            <button
              onClick={() => setTabActiva('tesis')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                tabActiva === 'tesis' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <span>⚖️</span> Gestión de Tesis
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {tesisLista.filter(t => calcularSemaforo(t.fechaSustentacion).nivel === 'rojo').length} urgentes
              </span>
            </button>

            <button
              onClick={() => setTabActiva('notificaciones')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap relative ${
                tabActiva === 'notificaciones' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <span>🔔</span> Notificaciones
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 1. VISTA DASHBOARD GENERAL */}
        {tabActiva === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Banner Saludo e Información Institucional */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-800">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-8 -translate-y-8 pointer-events-none">
                <LogoUNT className="h-64" />
              </div>
              <div className="relative z-10 max-w-3xl">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Portal Docente UNT 2026
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold mt-2 text-white">
                  Bienvenido, {DOCENTE_PERFIL.nombre}
                </h1>
                <p className="text-blue-200 mt-1 text-sm md:text-base leading-relaxed">
                  Plataforma oficial para la gestión de solicitudes de financiamiento de capacitaciones y seguimiento de sustentación de tesis asignadas como Asesor o Revisor.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setTabActiva('capacitaciones')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow transition-all flex items-center gap-2"
                  >
                    <span>➕</span> Solicitar Capacitación
                  </button>
                  <button 
                    onClick={() => setTabActiva('tesis')}
                    className="bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-600 px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
                  >
                    <span>📅</span> Ver Mis Sustentaciones Tesis
                  </button>
                </div>
              </div>
            </div>

            {/* Muestrario de Estadísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tesis Asignadas</span>
                  <span className="p-2 bg-blue-100 text-blue-800 rounded-lg text-lg">⚖️</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mt-2">{tesisLista.length}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {tesisLista.filter(t => t.rol === 'Asesor').length} Asesorías | {tesisLista.filter(t => t.rol === 'Revisor').length} Revisiones
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Sustentaciones Críticas</span>
                  <span className="p-2 bg-red-100 text-red-800 rounded-lg text-lg animate-pulse">🚨</span>
                </div>
                <div className="text-3xl font-black text-red-600 mt-2">
                  {tesisLista.filter(t => calcularSemaforo(t.fechaSustentacion).nivel === 'rojo').length}
                </div>
                <div className="text-xs text-red-600 font-medium mt-1">
                  Requieren libre disponibilidad en ≤ 7 días
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Capacitaciones Solicitadas</span>
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-lg text-lg">🎓</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mt-2">{solicitudes.length}</div>
                <div className="text-xs text-amber-700 font-medium mt-1">
                  Monto total: S/ {solicitudes.reduce((acc, s) => acc + Number(s.monto), 0).toLocaleString('es-PE')}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Notificaciones Sin Leer</span>
                  <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg text-lg">🔔</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mt-2">{unreadCount}</div>
                <div className="text-xs text-indigo-600 font-medium mt-1">
                  {unreadCount > 0 ? "Atención requerida" : "Al día con avisos"}
                </div>
              </div>

            </div>

            {/* SECCIÓN DE SUSTENTACIONES PRÓXIMAS (ALERTA SEMÁFORO ROJO/AMARILLO) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                    Alertas Inminentes de Sustentación de Tesis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sustentaciones con semáforo rojo (≤7 días) y amarillo (8-15 días) para coordinar horarios.
                  </p>
                </div>
                <button 
                  onClick={() => setTabActiva('tesis')}
                  className="text-xs font-bold text-blue-900 hover:text-amber-600 underline"
                >
                  Ver todas las tesis →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tesisLista
                  .map(t => ({ ...t, semaforo: calcularSemaforo(t.fechaSustentacion) }))
                  .filter(t => t.semaforo.nivel === 'rojo' || t.semaforo.nivel === 'amarillo')
                  .map(tesis => (
                    <div 
                      key={tesis.id} 
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        tesis.semaforo.nivel === 'rojo' 
                          ? 'bg-red-50/70 border-red-200' 
                          : 'bg-amber-50/70 border-amber-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tesis.semaforo.colorBadge}`}>
                            {tesis.semaforo.nivel === 'rojo' ? '🔴 ALERTA ROJA' : '🟡 ATENCIÓN'} - Quedan {tesis.semaforo.dias} días
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                            Rol: {tesis.rol}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{tesis.titulo}</h3>
                        <p className="text-xs text-slate-600 mt-1">👤 Estudiante: <span className="font-medium text-slate-800">{tesis.estudiante}</span></p>
                        <p className="text-xs text-slate-600 mt-0.5">🗓️ Fecha: <span className="font-semibold text-slate-900">{tesis.fechaSustentacion} ({tesis.horaSustentacion})</span></p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 italic">
                          {tesis.agendaAcomodada ? "✅ Horario apartado" : "⚠️ Pendiente bloquear horario"}
                        </span>
                        <button
                          onClick={() => setModalHorarioTesis(tesis)}
                          className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow"
                        >
                          📅 Acomodar Horario
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* RESUMEN DE SOLICITUDES DE CAPACITACIÓN RECIENTES */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🎓</span> Últimas Solicitudes de Capacitación Emitidas
                </h2>
                <button 
                  onClick={() => setTabActiva('mis_solicitudes')}
                  className="text-xs font-bold text-blue-900 hover:text-amber-600 underline"
                >
                  Ver historial completo →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {solicitudes.slice(0, 3).map(sol => (
                  <div key={sol.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {sol.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">Dirigido a: {sol.dirigidoA}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{sol.nombrePrograma}</h4>
                      <p className="text-xs text-slate-500">{sol.tipo} en {sol.institucion}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900">S/ {Number(sol.monto).toLocaleString('es-PE')}</div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          sol.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' :
                          sol.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {sol.estado}
                        </span>
                      </div>
                      <button
                        onClick={() => setModalDetalleSolicitud(sol)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. MÓDULO DE SOLICITUD DE CAPACITACIONES (FORMULARIO) */}
        {tabActiva === 'capacitaciones' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-6 rounded-2xl shadow-lg border-b-4 border-amber-500">
              <h1 className="text-2xl font-extrabold flex items-center gap-3">
                <span>🎓</span> Formulario de Solicitud de Capacitación Docente
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Exprese su necesidad de perfeccionamiento académico (Cursos, Maestrías, Doctorados) para solicitar financiamiento o subvención a las instancias universitarias correspondientes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  nombreDocente: formData.get('nombreDocente'),
                  departamento: formData.get('departamento'),
                  dirigidoA: formData.get('dirigidoA'),
                  tipo: formData.get('tipo'),
                  nombrePrograma: formData.get('nombrePrograma'),
                  institucion: formData.get('institucion'),
                  modalidad: formData.get('modalidad'),
                  monto: parseFloat(formData.get('monto')),
                  fechaInicio: formData.get('fechaInicio'),
                  fechaFin: formData.get('fechaFin'),
                  justificacion: formData.get('justificacion')
                };
                handleCrearSolicitud(data);
              }} className="space-y-6">

                {/* Sección 1: Datos del Docente y Destino */}
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-sm font-bold uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-2">
                    <span>📌</span> 1. Información del Remitente y Destino
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Docente</label>
                      <input 
                        type="text" 
                        name="nombreDocente" 
                        defaultValue={DOCENTE_PERFIL.nombre} 
                        required 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Departamento Academicó / Escuela</label>
                      <input 
                        type="text" 
                        name="departamento" 
                        defaultValue={DOCENTE_PERFIL.departamento} 
                        required 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dirigido a (Autoridad / Instancia de aprobación) *</label>
                      <select 
                        name="dirigidoA" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="Escuela de Ciencia Política">Escuela Profesional de Ciencia Política</option>
                        <option value="Facultad de Derecho y Ciencias Políticas">Decanatura de la Facultad de Derecho y Ciencias Políticas</option>
                        <option value="Rectorado">Rectorado de la Universidad Nacional de Trujillo</option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">Seleccione la instancia a la cual eleva la solicitud presupuestal.</p>
                    </div>
                  </div>
                </div>

                {/* Sección 2: Detalles del Programa Academicó */}
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-sm font-bold uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-2">
                    <span>📚</span> 2. Detalles del Programa de Capacitación
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Capacitación *</label>
                      <select 
                        name="tipo" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="Curso Especializado">Curso Especializado / Taller</option>
                        <option value="Maestría">Programa de Maestría</option>
                        <option value="Doctorado">Programa de Doctorado</option>
                        <option value="Diplomado">Diplomado de Posgrado</option>
                        <option value="Pasantía">Pasantía de Investigación</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Modalidad de Dictado *</label>
                      <select 
                        name="modalidad" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="Virtual">Virtual / Online</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrida">Híbrida / Semipresencial</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Programa o Evento *</label>
                      <input 
                        type="text" 
                        name="nombrePrograma" 
                        placeholder="Ej. Curso Internacional en Análisis de Políticas Públicas y Gobernanza local" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Institución u Organismo Organizador *</label>
                      <input 
                        type="text" 
                        name="institucion" 
                        placeholder="Ej. Universidad de Buenos Aires (UBA) / FLACSO" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 3: Presupuesto y Fechas */}
                <div>
                  <h3 className="text-sm font-bold uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-2">
                    <span>💵</span> 3. Monto Solicitado y Cronograma Tentativo
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Monto Aproximado Solicitado (S/) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">S/</span>
                        <input 
                          type="number" 
                          name="monto" 
                          step="50" 
                          placeholder="2500" 
                          required 
                          className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Tentativa de Inicio *</label>
                      <input 
                        type="date" 
                        name="fechaInicio" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Tentativa de Término *</label>
                      <input 
                        type="date" 
                        name="fechaFin" 
                        required 
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Justificación Académica e Impacto Institucional *</label>
                    <textarea 
                      name="justificacion" 
                      rows="4" 
                      placeholder="Explique detalladamente de qué manera este perfeccionamiento contribuirá a la mejora de la enseñanza docente, investigación o acreditación de la carrera profesional en la UNT..." 
                      required 
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setTabActiva('dashboard')} 
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-sm font-extrabold shadow-md hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center gap-2"
                  >
                    <span>🚀</span> Enviar Solicitud Presupuestal
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* 3. MÓDULO MIS SOLICITUDES DE CAPACITACIÓN */}
        {tabActiva === 'mis_solicitudes' && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>📂</span> Mis Solicitudes de Capacitación Registradas
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seguimiento en tiempo real de expedientes enviados para financiamiento académico UNT.
                </p>
              </div>

              <button 
                onClick={() => setTabActiva('capacitaciones')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition-all flex items-center gap-2 self-start md:self-auto"
              >
                <span>➕</span> Nueva Solicitud
              </button>
            </div>

            {/* Lista de Solicitudes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4">Código Exp.</th>
                      <th className="p-4">Programa / Capacitación</th>
                      <th className="p-4">Dirigido A</th>
                      <th className="p-4">Monto (S/)</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {solicitudes.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-900 whitespace-nowrap">{s.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{s.nombrePrograma}</div>
                          <div className="text-xs text-slate-500">{s.tipo} | {s.institucion}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-700 whitespace-nowrap">{s.dirigidoA}</td>
                        <td className="p-4 font-extrabold text-slate-900 whitespace-nowrap">
                          S/ {Number(s.monto).toLocaleString('es-PE')}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            s.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            s.estado === 'Rechazado' ? 'bg-red-100 text-red-800 border-red-300' :
                            'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          }`}>
                            {s.estado}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setModalDetalleSolicitud(s)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Ver Hoja Ruta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 4. MÓDULO DE GESTIÓN DE TESIS CON SEMÁFORO DE DÍAS RESTANTES */}
        {tabActiva === 'tesis' && (
          <div className="space-y-6">
            
            {/* Header del Módulo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>⚖️</span> Gestión de Tesis Asignadas y Semáforo de Sustentaciones
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Alertas preventivas automatizadas para acomodar horarios docentes según la inminencia del dictamen de sustentación.
                </p>
              </div>

              {/* Leyenda Visual del Semáforo */}
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl text-[11px] font-bold border border-slate-200">
                <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span> ≤ 7 días (Rojo)
                </span>
                <span className="flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-1 rounded border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 8-15 días (Amarillo)
                </span>
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-1 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> &gt; 15 días (Verde)
                </span>
              </div>
            </div>

            {/* Listado de Tarjetas de Tesis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tesisLista.map(tesis => {
                const semaforo = calcularSemaforo(tesis.fechaSustentacion);

                return (
                  <div 
                    key={tesis.id} 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Indicador de Borde Lateral Semáforo */}
                    <div className={`absolute top-0 left-0 bottom-0 w-2 ${semaforo.colorBg}`}></div>

                    <div>
                      {/* Encabezado Tarjeta */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                          {tesis.id}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${semaforo.colorBadge}`}>
                            {semaforo.dias} días restantes
                          </span>
                          <span className="bg-blue-900 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                            Rol: {tesis.rol}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-blue-900 transition-colors">
                        {tesis.titulo}
                      </h3>

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p>🎓 Bachiller: <span className="font-bold text-slate-800">{tesis.estudiante}</span></p>
                        <p>🏛️ Escuela: <span className="text-slate-700">{tesis.escuela}</span></p>
                        <p>📍 Lugar: <span className="text-slate-700">{tesis.lugar}</span></p>
                        <p>🗓️ Fecha & Hora: <span className="font-bold text-slate-900">{tesis.fechaSustentacion} a las {tesis.horaSustentacion}</span></p>
                      </div>

                      {/* BARRA DE PROGRESO TIPO SEMÁFORO */}
                      <div className="mt-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-bold text-slate-700">Progreso Cronograma</span>
                          <span className={`font-extrabold text-xs ${semaforo.colorText}`}>
                            {semaforo.estado} ({semaforo.dias} días)
                          </span>
                        </div>
                        
                        {/* Track de la barra */}
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${semaforo.colorBarra} transition-all duration-500`}
                            style={{ width: `${Math.min(100, Math.max(10, (30 - semaforo.dias) / 30 * 100))}%` }}
                          ></div>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-2 italic flex items-center gap-1">
                          <span>💡</span> {semaforo.alertaTexto}
                        </p>
                      </div>
                    </div>

                    {/* Acciones de la Tarjeta */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setModalDetalleTesis(tesis)}
                        className="text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Ver Expediente
                      </button>

                      <button
                        onClick={() => setModalHorarioTesis(tesis)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 ${
                          tesis.agendaAcomodada 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-amber-300'
                        }`}
                      >
                        <span>📅</span> {tesis.agendaAcomodada ? "Agenda Confirmada ✓" : "Acomodar Horario"}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 5. MÓDULO DE NOTIFICACIONES */}
        {tabActiva === 'notificaciones' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🔔</span> Centro de Notificaciones y Alertas
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recordatorios automáticos sobre fechas límites de tesis y trámites de capacitación.
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={marcarTodasLeidas}
                  className="text-xs font-bold text-blue-900 hover:text-amber-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {notificaciones.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No hay notificaciones registradas.
                </div>
              ) : (
                notificaciones.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-5 flex items-start gap-4 transition-colors ${
                      !n.leida ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mt-0.5">
                      {n.tipo === 'urgente' ? '🚨' : n.tipo === 'alerta' ? '🟡' : 'ℹ️'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-bold ${!n.leida ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.titulo}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">{n.fecha}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.mensaje}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => setTabActiva(n.linkTab)}
                          className="text-xs font-bold text-blue-900 hover:underline"
                        >
                          Ir al módulo correspondiente →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

      {/* --- MODAL DE ACOMODAR HORARIO / AGENDA PARA TESIS --- */}
      {modalHorarioTesis && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>📅</span> Acomodar Horario Docente
              </h3>
              <button onClick={() => setModalHorarioTesis(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900">
                <p className="font-bold">{modalHorarioTesis.titulo}</p>
                <p className="mt-1">👤 Estudiante: {modalHorarioTesis.estudiante}</p>
                <p className="mt-0.5 font-semibold text-amber-700">
                  🗓️ Sustentación: {modalHorarioTesis.fechaSustentacion} ({modalHorarioTesis.horaSustentacion})
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas de reestructuración de clases / asesorías:
                </label>
                <textarea 
                  rows="3" 
                  defaultValue={`Reserva de horario docente para acto de sustentación en ${modalHorarioTesis.lugar}. Solicitud de reprocesamiento de clases lectivas coincidentes.`}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  id="notasAgendaInput"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                ⚠️ Al confirmar, el sistema UNT marcará este bloque horario como <strong>Ocupado por Sustentación Oficial</strong> y notificará a la Dirección de Escuela.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setModalHorarioTesis(null)} 
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const val = document.getElementById('notasAgendaInput').value;
                  handleAcomodarHorario(modalHorarioTesis.id, val);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow"
              >
                Confirmar y Reservar Horario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLE DE SOLICITUD DE CAPACITACIÓN --- */}
      {modalDetalleSolicitud && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {modalDetalleSolicitud.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">Expediente de Capacitación</h3>
              </div>
              <button onClick={() => setModalDetalleSolicitud(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <p><strong>Programa:</strong> {modalDetalleSolicitud.nombrePrograma}</p>
              <p><strong>Institución:</strong> {modalDetalleSolicitud.institucion}</p>
              <p><strong>Destinatario:</strong> {modalDetalleSolicitud.dirigidoA}</p>
              <p><strong>Monto Solicitado:</strong> S/ {Number(modalDetalleSolicitud.monto).toLocaleString('es-PE')}</p>
              <p><strong>Justificación:</strong> {modalDetalleSolicitud.justificacion}</p>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>Estado Tramitación:</strong> <span className="font-bold text-amber-700">{modalDetalleSolicitud.estado}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setModalDetalleSolicitud(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLE EXPEDIENTE DE TESIS --- */}
      {modalDetalleTesis && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Expediente Digital de Tesis</h3>
              <button onClick={() => setModalDetalleTesis(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{modalDetalleTesis.titulo}</p>
              <p><strong>Bachiller:</strong> {modalDetalleTesis.estudiante}</p>
              <p><strong>Escuela Profesional:</strong> {modalDetalleTesis.escuela}</p>
              <p><strong>Rol Asignado:</strong> {modalDetalleTesis.rol}</p>
              <p><strong>Lugar de Sustentación:</strong> {modalDetalleTesis.lugar}</p>
              <p><strong>Fecha Programada:</strong> {modalDetalleTesis.fechaSustentacion} ({modalDetalleTesis.horaSustentacion})</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setModalDetalleTesis(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER INSTITUCIONAL UNT */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">Universidad Nacional de Trujillo — Portal de Gestión Docente</p>
          <p className="text-slate-500">Escuela Profesional de Ciencia Política & Facultad de Derecho y Ciencias Políticas © 2026</p>
        </div>
      </footer>

    </div>
  );
}