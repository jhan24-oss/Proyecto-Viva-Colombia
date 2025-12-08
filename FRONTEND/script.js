// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  try {
  // Mapa global de SVGs para aerolíneas (usado por badge y resumen)
  const AIRLINE_SVGS = {
    'Avianca': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 12c0 0 6-1 9-1s9-1 9-1-3 1-6 4-6 4-6 4l-6-6z" fill="#E60000"/></svg>`,
    'LATAM': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 12l8-6 6 6-8 6z" fill="#0033A0"/></svg>`,
    'Wingo': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#6A1B9A"/><text x="12" y="16" font-size="10" text-anchor="middle" fill="#fff">W</text></svg>`,
    'Viva Air': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2c3 0 6 4 6 8s-3 8-6 8-6-4-6-8 3-8 6-8z" fill="#00B894"/></svg>`
    ,
    'default': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 12l20-8-6 8 6 8z" fill="#666"/></svg>`
  };
  
  // Scroll suave
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('destinos').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Gastronomía: Filtrado por estrellas
  (function setupGastronomiaFilter(){
    const filterBtns = document.querySelectorAll('.stars-filter .filter-btn');
    const cards = document.querySelectorAll('.cards-grid .food-card');
    if (!filterBtns.length || !cards.length) return;

    function applyFilter(minStars){
      filterBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.filter,10) === minStars));
      cards.forEach(card => {
        const rating = parseInt(card.dataset.rating || '0', 10);
        if (minStars === 0) {
          card.style.display = '';
        } else {
          // mostramos cards con rating >= minStars
          card.style.display = rating >= minStars ? '' : 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const v = parseInt(btn.dataset.filter || '0', 10);
        applyFilter(v);
      });
    });
    // estado inicial: todos
    applyFilter(0);
  })();

  // Modal de login
  const authModal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const authSubmit = document.getElementById('authSubmit');
  const registerBtn = document.getElementById('registerBtn');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const authClose = document.getElementById('authClose');
  const authOverlay = document.getElementById('authOverlay');
  const toRegister = document.getElementById('toRegister');
  const toLogin = document.getElementById('toLogin');
  const registerSubmit = document.getElementById('registerSubmit');
  // Elementos del DOM que pueden no existir en todas las páginas
  const contactForm = document.getElementById('contactForm');
  const confirmarReservaBtn = document.getElementById('confirmarReserva');
  const confirmarReservaAlojamientoBtn = document.getElementById('confirmarReservaAlojamiento');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      // mostrar modal en modo login
      if (authModal) authModal.classList.remove('hidden');
      if (loginPanel) { loginPanel.classList.remove('hidden'); }
      if (registerPanel) { registerPanel.classList.add('hidden'); }
      // foco en email
      setTimeout(() => { document.getElementById('loginEmail')?.focus(); }, 50);
    });
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      if (authModal) authModal.classList.remove('hidden');
      if (registerPanel) { registerPanel.classList.remove('hidden'); }
      if (loginPanel) { loginPanel.classList.add('hidden'); }
      setTimeout(() => { document.getElementById('regNombres')?.focus(); }, 50);
    });
  }

  if (registerSubmit) {
    registerSubmit.addEventListener('click', async () => {
      const nombres = document.getElementById('regNombres')?.value || '';
      const apellidos = document.getElementById('regApellidos')?.value || '';
      const email = document.getElementById('regEmail')?.value || '';
      const password = document.getElementById('regPassword')?.value || '';

      if (!nombres || !email || !password) {
        alert('Por favor completa los campos requeridos');
        return;
      }

      const data = { nombre: `${nombres} ${apellidos}`.trim(), email, password };
      try {
        console.log('Register request ->', data);
        const res = await fetch('http://localhost:4000/api/usuarios/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        console.log('Register response raw ->', res);
        // Intentar parsear JSON; si falla, leer texto plano
        let result = null;
        let bodyText = '';
        try {
          result = await res.json();
        } catch (e) {
          // no JSON
          try { bodyText = await res.text(); } catch (e2) { bodyText = String(e2 || ''); }
          result = null;
        }
        console.log('Parsed register result ->', result, 'bodyText ->', bodyText);
        const regMsgEl = document.getElementById('registerMessage');
        if (res.ok && result && result.ok) {
          if (regMsgEl) {
            regMsgEl.textContent = 'Cuenta creada correctamente.';
            regMsgEl.classList.remove('hidden'); regMsgEl.classList.remove('error'); regMsgEl.classList.add('visible');
          }
          // Si el backend devuelve el usuario, iniciamos sesión automáticamente
          if (result.usuario && result.usuario.id) {
            const usuario = result.usuario;
            localStorage.setItem('usuario_id', usuario.id);
            localStorage.setItem('usuario_nombre', usuario.nombre || `${nombres} ${apellidos}`.trim() || email);
            try { updateNavbarUserState(usuario); } catch (e) { console.warn('No se pudo actualizar navbar', e); }
            // Cerrar modal después de breve delay
            setTimeout(() => { if (authModal) authModal.classList.add('hidden'); }, 900);
          } else {
            // fallback: auto-fill login email y mostrar panel de login
            document.getElementById('loginEmail').value = email;
            if (registerPanel) registerPanel.classList.add('hidden');
            if (loginPanel) loginPanel.classList.remove('hidden');
          }
        } else {
          // Construir mensaje de error: preferir result.error/result.mensaje, sino usar bodyText o status
          const serverMsg = (result && (result.error || result.mensaje)) ? (result.error || result.mensaje) : (bodyText || 'Respuesta inesperada del servidor');
          const msg = `Error ${res.status}${res.statusText ? ' ' + res.statusText : ''}: ${serverMsg}`;
          if (regMsgEl) {
            regMsgEl.textContent = msg;
            regMsgEl.classList.remove('hidden'); regMsgEl.classList.add('visible'); regMsgEl.classList.add('error');
            // asegurar que el mensaje y el botón 'Ya tengo cuenta' sean visibles
            regMsgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            alert(msg);
          }
        }
      } catch (err) {
        console.error('Error registrando usuario', err);
        const regMsgEl = document.getElementById('registerMessage');
        const msg = (err && err.message) ? err.message : 'Error registrando usuario (sin respuesta)';
        if (regMsgEl) {
          regMsgEl.textContent = `Error: ${msg}`;
          regMsgEl.classList.remove('hidden'); regMsgEl.classList.add('visible'); regMsgEl.classList.add('error');
          regMsgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert(msg);
        }
      }
    });
  }
  
// NOTE: Login handler más avanzado se define más abajo (con mensajes
// inline y actualización de la navbar). Evitamos duplicar el listener aquí.

// DEBUG: añadir botón para crear cuenta de prueba (útil para reproducir errores)
if (registerPanel) {
  try {
    const debugBtn = document.createElement('button');
    debugBtn.id = 'registerTestBtn';
    debugBtn.type = 'button';
    debugBtn.className = 'btn-primary';
    debugBtn.style.marginTop = '8px';
    debugBtn.style.background = 'linear-gradient(90deg,#00c9a7,#00b4d8)';
    debugBtn.textContent = 'Crear cuenta de prueba';
    const regMsgEl = document.getElementById('registerMessage');
    if (regMsgEl) registerPanel.insertBefore(debugBtn, regMsgEl);
    else registerPanel.appendChild(debugBtn);

    debugBtn.addEventListener('click', () => {
      const rand = Math.floor(Math.random() * 1000000);
      const nombres = 'Test';
      const apellidos = 'User' + rand;
      const email = `test${rand}@example.com`;
      const password = 'Test123!';
      const nombresEl = document.getElementById('regNombres');
      const apellidosEl = document.getElementById('regApellidos');
      const emailEl = document.getElementById('regEmail');
      const passwordEl = document.getElementById('regPassword');
      if (nombresEl) nombresEl.value = nombres;
      if (apellidosEl) apellidosEl.value = apellidos;
      if (emailEl) emailEl.value = email;
      if (passwordEl) passwordEl.value = password;
      // trigger the same submit handler
      if (registerSubmit) registerSubmit.click();
    });
  } catch (e) { console.warn('No se pudo añadir botón debug de registro', e); }
}

// Manejador visual-only para login/registro: mostrar éxito aunque no haya backend
if (authSubmit) {
  authSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const authMsgEl = document.getElementById('authMessage');
    // Determinar qué panel está visible
    const isRegisterVisible = registerPanel && !registerPanel.classList.contains('hidden');
    const isLoginVisible = loginPanel && !loginPanel.classList.contains('hidden');

    try {
      if (isRegisterVisible) {
        const nombres = (document.getElementById('regNombres')?.value || '').trim();
        const apellidos = (document.getElementById('regApellidos')?.value || '').trim();
        const email = (document.getElementById('regEmail')?.value || '').trim();
        const displayName = (nombres || apellidos) ? `${nombres} ${apellidos}`.trim() : (email || 'Usuario');

        // Mensaje visual
        if (authMsgEl) {
          authMsgEl.textContent = `Cuenta creada. Sesión iniciada como ${displayName}`;
          authMsgEl.classList.remove('hidden'); authMsgEl.classList.remove('error'); authMsgEl.classList.add('visible');
        } else {
          alert(`Cuenta creada. Sesión iniciada como ${displayName}`);
        }

        // Estado visual de usuario (localStorage + navbar)
        try {
          localStorage.setItem('usuario_id', `visual-${Date.now()}`);
          localStorage.setItem('usuario_nombre', displayName);
          updateNavbarUserState({ nombre: displayName, email });
        } catch (e) { console.warn('No se pudo guardar usuario en localStorage', e); }

        // Cerrar modal tras breve pausa para que el usuario vea el mensaje
        setTimeout(() => { if (authModal) authModal.classList.add('hidden'); }, 900);
        return;
      }

      if (isLoginVisible) {
        const email = (document.getElementById('loginEmail')?.value || '').trim();
        const displayName = email || 'Usuario';

        if (authMsgEl) {
          authMsgEl.textContent = `Sesión iniciada como ${displayName}`;
          authMsgEl.classList.remove('hidden'); authMsgEl.classList.remove('error'); authMsgEl.classList.add('visible');
        } else {
          alert(`Sesión iniciada como ${displayName}`);
        }

        try {
          localStorage.setItem('usuario_id', `visual-${Date.now()}`);
          localStorage.setItem('usuario_nombre', displayName);
          updateNavbarUserState({ nombre: displayName, email });
        } catch (e) { console.warn('No se pudo guardar usuario en localStorage', e); }

        setTimeout(() => { if (authModal) authModal.classList.add('hidden'); }, 700);
        return;
      }

      // Fallback: si no se detecta panel, simplemente cerrar
      if (authMsgEl) {
        authMsgEl.textContent = 'Sesión iniciada';
        authMsgEl.classList.remove('hidden'); authMsgEl.classList.remove('error'); authMsgEl.classList.add('visible');
      }
      setTimeout(() => { if (authModal) authModal.classList.add('hidden'); }, 700);
    } catch (err) {
      console.error('Error visual auth submit', err);
      if (authMsgEl) { authMsgEl.textContent = 'Error iniciando sesión'; authMsgEl.classList.remove('hidden'); authMsgEl.classList.add('error'); }
    }
  });
}

  // Contacto
 if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('contactNombre').value,
      email: document.getElementById('contactEmail').value,
      telefono: document.getElementById('contactTelefono').value,
      asunto: document.getElementById('contactAsunto').value,
      mensaje: document.getElementById('contactMensaje').value
    };

    const res = await fetch('http://localhost:4000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.mensaje || result.error);
    e.target.reset();
  });
}

// ------------------ DATOS COMPLETOS ------------------

// (Datos disponibles para futuras funcionalidades)
/*
const destinations = [
  { name: "Cartagena de Indias", city: "Cartagena, Bolívar" },
  { name: "Valle de Cocora", city: "Salento, Quindío" },
  { name: "Parque Tayrona", city: "Santa Marta, Magdalena" },
  { name: "Caño Cristales", city: "La Macarena, Meta" },
  { name: "Guatapé", city: "Guatapé, Antioquia" },
  { name: "San Andrés Isla", city: "San Andrés y Providencia" },
  { name: "Ciudad Perdida", city: "Sierra Nevada, Magdalena" },
  { name: "Bogotá", city: "Bogotá, D.C." },
  { name: "Medellín", city: "Medellín, Antioquia" },
  { name: "Desierto de la Tatacoa", city: "Villavieja, Huila" }
];

const activities = [
  { name: "Ciudad Amurallada de Cartagena", city: "Cartagena, Bolívar" },
  { name: "Castillo de San Felipe de Barajas", city: "Cartagena, Bolívar" },
  { name: "Museo del Oro", city: "Bogotá, D.C." },
  { name: "Museo Botero", city: "Bogotá, D.C." },
  { name: "Arte Callejero de Bogotá", city: "Bogotá, D.C." },
  { name: "Ciudad Perdida", city: "Sierra Nevada, Magdalena" },
  { name: "Piedra del Peñol", city: "Guatapé, Antioquia" },
  { name: "Parque Nacional Tayrona", city: "Santa Marta, Magdalena" },
  { name: "Valle de Cocora", city: "Salento, Quindío" },
  { name: "Caño Cristales", city: "La Macarena, Meta" },
  { name: "Surf en el Caribe", city: "San Andrés y Cabo de la Vela" },
  { name: "Exploración Amazónica", city: "Leticia, Amazonas" },
  { name: "Cerro de Monserrate", city: "Bogotá, D.C." },
  { name: "Parque Los Nevados", city: "Eje Cafetero" },
  { name: "Islas del Rosario", city: "Cartagena, Bolívar" }
];

const accommodations = [
  { name: "Cannatel Exclusive Hotel", location: "Armenia, Quindío", price: 337327 },
  { name: "Hotel Boutique & Spa Terra Barichara", location: "Barichara, Santander", price: 374000 },
  { name: "Hotel Termales El Otoño", location: "Manizales, Caldas", price: 250000 },
  { name: "Hotel Boutique Casa Carolina", location: "Cartagena, Bolívar", price: 450000 },
  { name: "Hotel B3 Virrey", location: "Bogotá, D.C.", price: 300000 }
];
*/

  const hero = document.querySelector('.hero-overlay');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    setTimeout(() => {
      hero.style.transition = 'all 1s ease';
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);

  }

  // Animación de entrada para la sección "¿Quiénes Somos?"
  window.addEventListener('scroll', () => {
    const section = document.querySelector('.about-section');
    if (!section) return;
    const position = section.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (position < screenHeight - 100) {
      section.classList.add('visible');
    }
  });

  // Mostrar pantalla de reserva al hacer clic en una card
  const destinoCards = document.querySelectorAll('.destino-card');
  console.log('Tarjetas encontradas:', destinoCards.length);
  
  destinoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const titleEl = card.querySelector('h3, h4, .destino-title');
      const title = titleEl ? titleEl.textContent.trim() : `Destino ${index + 1}`;
      const modal = document.getElementById('reserva');
      if (!modal) return;
      document.getElementById('reserva-titulo').textContent = `Reservar: ${title}`;
      modal.classList.remove('hidden');
      const destinosEl = document.getElementById('destinos');
      if (destinosEl) destinosEl.style.display = 'none';
      updateSteps(1);
    });
  });

    // Actualizar la navbar para mostrar nombre del usuario y logout
    function updateNavbarUserState(usuario) {
      const navActions = document.querySelector('.navbar-actions');
      if (!navActions) return;
      // ocultar boton login
      if (loginBtn) loginBtn.style.display = 'none';

      // evitar duplicados
      let existing = document.getElementById('userBox');
      if (existing) existing.remove();

      const name = usuario.nombre || usuario.email || 'Usuario';
      const box = document.createElement('div');
      box.id = 'userBox';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.innerHTML = `<span class="navbar-user">Hola, ${escapeHtml(name)}</span><button id="logoutBtn" class="navbar-logout">Cerrar sesión</button>`;
      navActions.appendChild(box);

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('usuario_id');
          localStorage.removeItem('usuario_nombre');
          if (box) box.remove();
          if (loginBtn) loginBtn.style.display = '';
        });
      }
    }

    function escapeHtml(s) { return String(s).replace(/[&"'<>]/g, (c) => ({'&':'&amp;','"':'&quot;',"'":"&#39;","<":"&lt;",">":"&gt;"}[c])); }
  if (cerrarReserva) {
    cerrarReserva.addEventListener('click', () => {
      document.getElementById('reserva').classList.add('hidden');
      document.getElementById('destinos').style.display = 'block';
      document.getElementById('alojamientos').style.display = 'block';
    });
  }

  // Cerrar confirmación (destinos)
  const cerrarConfirmacion = document.getElementById('cerrarConfirmacion');
  const cerrarConfirmacion2 = document.getElementById('cerrarConfirmacion2');

  function cerrarConfirmacionFn() {
    // ocultar modal de confirmación
    const conf = document.getElementById('confirmacion');
    if (conf) conf.classList.add('hidden');

    // asegurar que el modal de reserva esté oculto y resetear su estado
    const reserva = document.getElementById('reserva');
    if (reserva) reserva.classList.add('hidden');

    // Mostrar secciones principales
    const destinosEl = document.getElementById('destinos');
    if (destinosEl) destinosEl.style.display = 'block';
    const alojEl = document.getElementById('alojamientos');
    if (alojEl) alojEl.style.display = 'block';

    // Reset pasos y campos de reserva
    try {
      updateSteps(0);
    } catch (e) {}

    // limpiar campos del modal de reserva
    const fechaEl = document.getElementById('fecha'); if (fechaEl) fechaEl.value = '';
    const categoriaChecked = document.querySelectorAll('#reserva input[name="categoria"]');
    categoriaChecked.forEach(i => { i.checked = false; if (i.closest('.categoria-option')) i.closest('.categoria-option').classList.remove('selected'); });
    const pagoChecked = document.querySelectorAll('#reserva input[name="pago"]');
    pagoChecked.forEach(i => { i.checked = false; if (i.closest('.payment-option')) i.closest('.payment-option').classList.remove('selected'); });
    const aerolineaSelect = document.getElementById('aerolinea'); if (aerolineaSelect) { aerolineaSelect.value = ''; }

    // reset resumen
    const resumenFecha = document.getElementById('resumen-fecha'); if (resumenFecha) resumenFecha.textContent = '-';
    const resumenCategoria = document.getElementById('resumen-categoria'); if (resumenCategoria) resumenCategoria.textContent = '-';
    const resumenAero = document.getElementById('resumen-aerolinea'); if (resumenAero) resumenAero.innerHTML = '-';
    const resumenTotal = document.getElementById('resumen-total'); if (resumenTotal) resumenTotal.textContent = '-';
  }

  if (cerrarConfirmacion) cerrarConfirmacion.addEventListener('click', cerrarConfirmacionFn);
  if (cerrarConfirmacion2) cerrarConfirmacion2.addEventListener('click', cerrarConfirmacionFn);

  const continuarPaso1Btn = document.getElementById('continuarPaso1');
  if (continuarPaso1Btn) {
    continuarPaso1Btn.addEventListener('click', () => {
      const fechaVal = document.getElementById('fecha').value;
      if (!fechaVal) {
        alert('Por favor selecciona una fecha');
        return;
      }
      document.getElementById('resumen-fecha').textContent = new Date(fechaVal).toLocaleDateString('es-ES');
      document.getElementById('paso1').classList.add('hidden');
      document.getElementById('paso2').classList.remove('hidden');
      updateSteps(2);
    });
  }

  const continuarPaso2Btn = document.getElementById('continuarPaso2');
  if (continuarPaso2Btn) {
    continuarPaso2Btn.addEventListener('click', () => {
      const categoriaInput = document.querySelector('input[name="categoria"]:checked');
      const aerolineaSelect = document.getElementById('aerolinea');
      if (!categoriaInput) {
        alert('Por favor selecciona una categoría de vuelo');
        return;
      }
      if (!aerolineaSelect || !aerolineaSelect.value) {
        alert('Por favor selecciona una aerolínea');
        return;
      }

      // Obtener precio desde la etiqueta .option-price dentro del label seleccionado
      let price = 0;
      const categoriaLabel = categoriaInput.closest('.categoria-option');
      if (categoriaLabel) {
        const priceEl = categoriaLabel.querySelector('.option-price');
        if (priceEl) {
          const raw = priceEl.textContent || '';
          const digits = raw.replace(/[^0-9]/g, '');
          price = digits ? parseInt(digits, 10) : 0;
        }
      }

      document.getElementById('resumen-categoria').textContent = categoriaInput.value;
      // Añadir icono SVG al resumen (se actualiza también por el badge)
      const resumenAeroEl = document.getElementById('resumen-aerolinea');
      const svgForAero = AIRLINE_SVGS[aerolineaSelect.value] || AIRLINE_SVGS['default'];
      if (resumenAeroEl) {
        resumenAeroEl.innerHTML = `${svgForAero} <span class="aero-name">${aerolineaSelect.value}</span>`;
      }
      document.getElementById('resumen-total').textContent = price ? `$${price.toLocaleString('es-CO')} COP` : 'Consultar precio';

      document.getElementById('paso2').classList.add('hidden');
      document.getElementById('paso3').classList.remove('hidden');
      updateSteps(3);
    });
  }

if (confirmarReservaBtn) {
  confirmarReservaBtn.addEventListener('click', async () => {
    const pago = document.querySelector('input[name="pago"]:checked');
    if (!pago) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    const usuario_id = localStorage.getItem('usuario_id') || 1;
    const data = {
      usuario_id,
      destino: (document.getElementById('reserva-titulo')?.textContent || '').replace('Reservar: ', ''),
      fecha: document.getElementById('fecha')?.value || '',
      categoria: (document.querySelector('input[name="categoria"]:checked')?.value) || '',
      aerolinea: document.getElementById('aerolinea')?.value || '',
      total_cop: 500000,
      metodo_pago: pago.value
    };

    // Intentamos enviar al backend, pero independientemente del resultado
    // siempre mostramos la confirmación (modo visual-only)
    let serverMsg = null;
    try {
      const res = await fetch('http://localhost:4000/api/reservas/destino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      try { const parsed = await res.json(); serverMsg = parsed && (parsed.mensaje || parsed.error) ? (parsed.mensaje || parsed.error) : null; }
      catch (e) { try { serverMsg = await res.text(); } catch (_) { serverMsg = null; } }
    } catch (err) {
      console.warn('Reserva: no se pudo enviar al servidor (modo visual):', err);
      serverMsg = null;
    }

    // Mostrar confirmación VISUAL siempre — reconstruir contenido para estilo
    const confirmModal = document.getElementById('confirmacion');
    const destinoName = document.getElementById('reserva-titulo')?.textContent || '';
    const totalText = document.getElementById('resumen-total')?.textContent || '';
    const pagoText = pago.value || (pago.closest('.payment-option')?.querySelector('.payment-text')?.textContent) || 'Método seleccionado';

    if (confirmModal) {
      const modalContent = confirmModal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="confirm-header">
            <h2>¡Reserva Confirmada!</h2>
            <button class="modal-close" id="confirmCloseHeader">×</button>
          </div>
          <div class="confirm-body">
            <p class="subtitle">Tu viaje está listo</p>
            <div class="check-icon-circle"><span class="check">✔️</span></div>
            <h3>¡Gracias por tu reserva!</h3>
            <p id="confirmacion-mensaje">Recibirás un correo con los detalles de tu viaje.</p>
            <button id="cerrarConfirmacion2" class="btn-close-confirmation">Cerrar</button>
          </div>
        `;

        const msgEl = modalContent.querySelector('#confirmacion-mensaje');
        if (msgEl) {
          const base = `Recibirás un correo con los detalles de tu viaje. ${destinoName} — ${totalText} • Pago: ${pagoText}`;
          msgEl.textContent = serverMsg ? `${base} — ${serverMsg}` : base;
        }

        // abrir modal
        document.getElementById('reserva')?.classList.add('hidden');
        confirmModal.classList.remove('hidden');

        // escuchar cierres dentro del contenido recién creado
        document.getElementById('confirmCloseHeader')?.addEventListener('click', cerrarConfirmacionFn);
        document.getElementById('cerrarConfirmacion2')?.addEventListener('click', cerrarConfirmacionFn);
      }
    }
  });
}

  // Visual: marcar tarjeta de pago seleccionada en modal de destinos
  (function attachPaymentOptionHandlers(){
    const paymentLabels = document.querySelectorAll('#reserva .payment-option');
    if (!paymentLabels || paymentLabels.length === 0) return;

    paymentLabels.forEach(label => {
      const input = label.querySelector('input[type="radio"]');
      if (!input) return;

      // Mantener visual al cambiar
      input.addEventListener('change', () => {
        paymentLabels.forEach(l => l.classList.remove('selected'));
        if (input.checked) label.classList.add('selected');
      });

      // Permitir clic en la tarjeta para seleccionar la radio
      label.addEventListener('click', (e) => {
        // Evitar doble disparo si se hizo click directamente en el input
        if (e.target.tagName.toLowerCase() === 'input') return;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  })();

  // Visual: marcar tarjeta de CATEGORÍA seleccionada en modal de destinos
  (function attachCategoriaHandlers(){
    const categoriaLabels = document.querySelectorAll('#reserva .categoria-option');
    if (!categoriaLabels || categoriaLabels.length === 0) return;

    categoriaLabels.forEach(label => {
      const input = label.querySelector('input[type="radio"]');
      if (!input) return;

      // Cuando cambie el radio, actualizar visual
      input.addEventListener('change', () => {
        categoriaLabels.forEach(l => l.classList.remove('selected'));
        if (input.checked) label.classList.add('selected');
      });

      // Clic en la tarjeta selecciona el radio
      label.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  })();

  // Aerolíneas: Añadir badge con icono junto al select y sincronizar con resumen
  (function setupAirlineBadge(){
    const select = document.getElementById('aerolinea');
    if (!select) return;

    // Crear wrapper alrededor del select si no existe
    if (!select.parentElement.classList.contains('aerolinea-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'aerolinea-wrapper';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      const badge = document.createElement('span');
      badge.className = 'aerolinea-badge';
      badge.innerHTML = AIRLINE_SVGS[select.value] || AIRLINE_SVGS['default'];
      wrapper.insertBefore(badge, select);

      select.addEventListener('change', () => {
        badge.innerHTML = AIRLINE_SVGS[select.value] || AIRLINE_SVGS['default'];
      });
    }
  })();

  // --- Alojamientos: datos y renderizado (Hoteles / Cabañas / Glamping)
  const accommodationsData = [
    { name: "Cannatel Exclusive Hotel", location: "Armenia, Quindío", price: 337327, rating: 4.9, type: "Hoteles", description: "Hotel 4 estrellas con vistas al paisaje cafetero y servicios de lujo.", image: "https://images.unsplash.com/photo-1501117716987-c8e5b34a3b1b?w=800&h=600&fit=crop" },
    { name: "Hotel Boutique & Spa", location: "Barichara, Santander", price: 374000, rating: 4.8, type: "Hoteles", description: "Hotel boutique con spa en el pueblo colonial de Barichara.", image: "https://images.unsplash.com/photo-1501117716987-c8e5b34a3b1b?w=800&h=600&fit=crop" },
    { name: "Hotel Termales El Otoño", location: "Manizales, Caldas", price: 439388, rating: 4.4, type: "Hoteles", description: "Hotel con termales naturales y rutas de montaña.", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop" },
    { name: "Bio Habitat Hotel", location: "Circasia, Quindío", price: 547217, rating: 4.6, type: "Hoteles", description: "Eco hotel con cabañas luminosas y vistas al paisaje cafetero.", image: "https://images.unsplash.com/photo-1505691723518-36a83a1b0d68?w=800&h=600&fit=crop" },
    { name: "Luxé by The Charlee", location: "Guatapé, Antioquia", price: 867887, rating: 4.2, type: "Hoteles", description: "Chalés de lujo con vistas al embalse de Guatapé.", image: "https://images.unsplash.com/photo-1501117716987-c8e5b34a3b1b?w=800&h=600&fit=crop" },

    { name: "Magma Eco Hotel", location: "La Vega, Cundinamarca", price: 327000, rating: 4.9, type: "Cabañas", description: "Eco cabañas inmersas en la naturaleza con piscina y vistas.", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&h=600&fit=crop" },
    { name: "Natubri EcoHotel", location: "San Francisco de Sales, Cundinamarca", price: 389036, rating: 4.8, type: "Cabañas", description: "EcoHotel de alta calificación rodeado de bosque nativo.", image: "https://images.unsplash.com/photo-1505691723518-36a83a1b0d68?w=800&h=600&fit=crop" },
    { name: "Casa en el Árbol - Dosis", location: "Útica, Cundinamarca", price: 349000, rating: 4.8, type: "Cabañas", description: "Alojamiento temático único en una casa en el árbol.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop" },
    { name: "Cabañas Termales", location: "Manizales, Caldas", price: 439707, rating: 4.4, type: "Cabañas", description: "Casas de campo con acceso a spa geotérmico y vistas al valle.", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&h=600&fit=crop" },
    { name: "Bio Habitat Cabañas", location: "Circasia, Quindío", price: 517292, rating: 4.6, type: "Cabañas", description: "Cabañas luminosas con vista al bosque en el Eje Cafetero.", image: "https://images.unsplash.com/photo-1505691723518-36a83a1b0d68?w=800&h=600&fit=crop" },

    { name: "Glamping Wayra", location: "Guatavita, Cundinamarca", price: 280000, rating: 4.9, type: "Glamping", description: "Glamping con vista a la represa y cielo estrellado.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop" },
    { name: "Glamping Entre Ríos", location: "Calarcá, Quindío", price: 744942, rating: 4.9, type: "Glamping", description: "Glamping de alta gama en el Eje Cafetero.", image: "https://images.unsplash.com/photo-1505691723518-36a83a1b0d68?w=800&h=600&fit=crop" },
    { name: "Teva Glamping & Retreat", location: "Medellín, Antioquia", price: 258000, rating: 4.5, type: "Glamping", description: "Glamping con retiros de bienestar y vistas al valle.", image: "https://images.unsplash.com/photo-1501117716987-c8e5b34a3b1b?w=800&h=600&fit=crop" },
    { name: "Glamping Lumbre", location: "Salento, Quindío", price: 530780, rating: 4.4, type: "Glamping", description: "Carpas luminosas en la montaña con vistas al Valle de Cocora.", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&h=600&fit=crop" },
    { name: "Terramaga Glamping", location: "San Francisco de Sales, Cundinamarca", price: 230000, rating: 4.6, type: "Glamping", description: "Glamping con fogatas y experiencias locales.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop" }
  ];

  function renderAccommodations() {
    const section = document.getElementById('alojamientos');
    if (!section) return;

    // Limpiar sección y crear tabs + grid
    section.innerHTML = `
      <h2>Alojamientos</h2>
      <p class="alojamientos-subtitle">Descubre dónde hospedarte en Colombia: desde hoteles modernos hasta cabañas acogedoras y experiencias únicas de glamping.</p>
      <div class="accommodation-tabs">
        <button class="tab-btn active" data-tab="Hoteles">Hoteles</button>
        <button class="tab-btn" data-tab="Cabañas">Cabañas</button>
        <button class="tab-btn" data-tab="Glamping">Glamping</button>
      </div>
      <div id="accommodationsGrid" class="grid accommodations-grid"></div>
    `;

    const grid = document.getElementById('accommodationsGrid');
    const tabs = section.querySelectorAll('.tab-btn');

    function filterAndRender(type) {
      const filtered = accommodationsData.filter(a => a.type === type);
      grid.innerHTML = filtered.map(acc => `
        <div class="accommodation-card">
          <div class="accommodation-image">
            <img src="${acc.image}" alt="${acc.name}">
            <div class="rating">⭐ ${acc.rating}</div>
            <div class="image-location">📍 ${acc.location}</div>
          </div>
          <div class="accommodation-info">
            <h3>${acc.name}</h3>
            <p class="location">${acc.location}</p>
            <p class="description">${acc.description}</p>
            <div class="accommodation-footer">
              <span class="price">$${acc.price.toLocaleString('es-CO')} COP/noche</span>
              <button class="btn-reserve" data-name="${acc.name}" data-location="${acc.location}" data-price="${acc.price}">Reservar</button>
            </div>
          </div>
        </div>
      `).join('');

      // Attach reserve handlers
      const allButtons = grid.querySelectorAll('.btn-reserve');
      allButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const name = this.dataset.name;
          const location = this.dataset.location;
          const price = Number(this.dataset.price);
          openAccommodationReservation(name, location, price);
        });
      });
    }

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterAndRender(btn.dataset.tab);
      });
    });

    // Render por defecto
    filterAndRender('Hoteles');
  }

  function openAccommodationReservation(name, location, price) {
    const modal = document.getElementById('reservaAlojamiento');
    if (!modal) return;
    
    // Guardar datos en variables globales para usar después
    window.accommodationData = { name, location, price };
    
    const tituloEl = document.getElementById('reserva-alojamiento-titulo');
    if (tituloEl) tituloEl.textContent = `Reservar: ${name}`;
    const locEl = document.getElementById('reserva-alojamiento-ubicacion');
    if (locEl) locEl.textContent = location;

    modal.classList.remove('hidden');
    const alojEl = document.getElementById('alojamientos');
    if (alojEl) alojEl.style.display = 'none';

    // Reset pasos
    document.getElementById('paso-alojamiento-1').classList.remove('hidden');
    document.getElementById('paso-alojamiento-2').classList.add('hidden');
    
      const fechaIngresoEl = document.getElementById('fecha-ingreso');
      const fechaSalidaEl = document.getElementById('fecha-salida');
      const numeroHuespedesEl = document.getElementById('numero-huespedes');

      if (fechaIngresoEl) fechaIngresoEl.value = '';
      if (fechaSalidaEl) fechaSalidaEl.value = '';
      if (numeroHuespedesEl) numeroHuespedesEl.value = '1';

      if (fechaIngresoEl) fechaIngresoEl.addEventListener('change', updatePriceAlojamiento);
      if (fechaSalidaEl) fechaSalidaEl.addEventListener('change', updatePriceAlojamiento);
      if (numeroHuespedesEl) numeroHuespedesEl.addEventListener('change', updatePriceAlojamiento);
    updatePriceAlojamiento();
  }

  function updatePriceAlojamiento() {
    const fechaIngreso = document.getElementById('fecha-ingreso')?.value || '';
    const fechaSalida = document.getElementById('fecha-salida')?.value || '';
    const numeroHuespedes = parseInt(document.getElementById('numero-huespedes')?.value || '1') || 1;
    const precioNoche = window.accommodationData?.price || 0;

    let noches = 0;
    if (fechaIngreso && fechaSalida) {
      const ingreso = new Date(fechaIngreso);
      const salida = new Date(fechaSalida);
      noches = Math.ceil((salida - ingreso) / (1000 * 60 * 60 * 24));
      if (noches < 0) noches = 0;
    }

    const total = noches * precioNoche;
    
    const nochesInfoEl = document.getElementById('noches-info');
    const precioPorNocheEl = document.getElementById('precio-por-noche');
    const precioTotalEl = document.getElementById('precio-total-alojamiento');
    if (nochesInfoEl) nochesInfoEl.textContent = `${noches} ${noches === 1 ? 'noche' : 'noches'}`;
    if (precioPorNocheEl) precioPorNocheEl.textContent = `x $${precioNoche.toLocaleString('es-CO')} COP`;
    if (precioTotalEl) precioTotalEl.textContent = `$${total.toLocaleString('es-CO')} COP`;
    
    // Guardar para paso 2
    window.accommodationData.noches = noches;
    window.accommodationData.total = total;
  }

  // Event listeners para cambios en fechas/huéspedes
  // listeners añadidos previamente con guardas; eliminar duplicados sin guardas

  // Continuar a pago (Paso 1 -> Paso 2)
  const continuarPagoAlojamientoBtn = document.getElementById('continuarPagoAlojamiento');
  if (continuarPagoAlojamientoBtn) {
    continuarPagoAlojamientoBtn.addEventListener('click', () => {
      const fechaIngreso = document.getElementById('fecha-ingreso').value;
      const fechaSalida = document.getElementById('fecha-salida').value;
      
      if (!fechaIngreso || !fechaSalida) {
        alert('Por favor selecciona ambas fechas');
        return;
      }

      // Rellenar resumen
      document.getElementById('resumen-alojamiento-nombre').textContent = window.accommodationData.name;
      document.getElementById('resumen-check-in').textContent = new Date(fechaIngreso).toLocaleDateString('es-ES');
      document.getElementById('resumen-check-out').textContent = new Date(fechaSalida).toLocaleDateString('es-ES');
      document.getElementById('resumen-huespedes').textContent = document.getElementById('numero-huespedes').value;
      document.getElementById('resumen-noches-paso2').textContent = window.accommodationData.noches;
      document.getElementById('resumen-total-alojamiento').textContent = `$${window.accommodationData.total.toLocaleString('es-CO')} COP`;

      // Cambiar paso
      document.getElementById('paso-alojamiento-1').classList.add('hidden');
      document.getElementById('paso-alojamiento-2').classList.remove('hidden');
    });
  }

  // Volver de paso 2 a paso 1
  const volverPasoAlojamiento1 = document.getElementById('volverPasoAlojamiento1');
  if (volverPasoAlojamiento1) {
    volverPasoAlojamiento1.addEventListener('click', () => {
      document.getElementById('paso-alojamiento-2').classList.add('hidden');
      document.getElementById('paso-alojamiento-1').classList.remove('hidden');
    });
  }

  // Confirmar reserva de alojamiento
if (confirmarReservaAlojamientoBtn) {
  confirmarReservaAlojamientoBtn.addEventListener('click', async () => {
    const pagoAlojamiento = document.querySelector('input[name="pago-alojamiento"]:checked');
    if (!pagoAlojamiento) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    const usuario_id = localStorage.getItem('usuario_id') || 1;
    const data = {
      usuario_id,
      alojamiento: window.accommodationData.name,
      ubicacion: window.accommodationData.location,
      check_in: document.getElementById('fecha-ingreso').value,
      check_out: document.getElementById('fecha-salida').value,
      huespedes: document.getElementById('numero-huespedes').value,
      total_cop: window.accommodationData.total,
      metodo_pago: pagoAlojamiento.value
    };

      let serverMsgAlo = null;
      try {
        const res = await fetch('http://localhost:4000/api/reservas/alojamiento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        try { const parsed = await res.json(); serverMsgAlo = parsed && (parsed.mensaje || parsed.error) ? (parsed.mensaje || parsed.error) : null; }
        catch (e) { try { serverMsgAlo = await res.text(); } catch (_) { serverMsgAlo = null; } }
      } catch (err) {
        console.warn('Reserva alojamiento: no se pudo enviar al servidor:', err);
        serverMsgAlo = null;
      }

      // Reconstruir modal de confirmación con el mismo estilo visual que destinos
      const confirmAloModal = document.getElementById('confirmacionAlojamiento');
      const reservaAloEl = document.getElementById('reservaAlojamiento');
      const alojamientoName = window.accommodationData?.name || '';
      const totalAloText = window.accommodationData?.total ? `$${window.accommodationData.total.toLocaleString('es-CO')} COP` : '-';
      const pagoAloText = pagoAlojamiento.value || 'Método seleccionado';

      if (confirmAloModal) {
        const modalContent = confirmAloModal.querySelector('.modal-content');
        const generated = `
            <div class="confirm-header">
              <h2>¡Reserva de Alojamiento Confirmada!</h2>
              <button class="modal-close" id="confirmCloseHeaderAlo">×</button>
            </div>
            <div class="confirm-body">
              <p class="subtitle">Tu hospedaje está reservado</p>
              <div class="check-icon-circle"><span class="check">✔️</span></div>
              <h3>¡Gracias por tu reserva!</h3>
              <p id="confirmacionAlojamiento-mensaje">Detalles de la reserva.</p>
              <button id="cerrarConfirmacionAlojamiento2" class="btn-close-confirmation">Cerrar</button>
            </div>
        `;

        if (modalContent) {
          modalContent.innerHTML = generated;
        } else {
          // Fallback: si no hay .modal-content, inyectar directamente
          confirmAloModal.innerHTML = generated;
        }

        // Actualizar mensaje y abrir modal
        const msgEl = document.getElementById('confirmacionAlojamiento-mensaje');
        if (msgEl) {
          const base = `Reserva confirmada en ${alojamientoName}, total: ${totalAloText} • Pago: ${pagoAloText}`;
          msgEl.textContent = serverMsgAlo ? `${base} — ${serverMsgAlo}` : base;
        }

        if (reservaAloEl) reservaAloEl.classList.add('hidden');
        confirmAloModal.classList.remove('hidden');

        // Enlazar cierres del contenido (IDs creados arriba)
        document.getElementById('confirmCloseHeaderAlo')?.addEventListener('click', cerrarConfirmacionAlojamientoFn);
        document.getElementById('cerrarConfirmacionAlojamiento2')?.addEventListener('click', cerrarConfirmacionAlojamientoFn);
      }
});
}

      // Nota: no cerrar/modificar el estado de modales globalmente aquí —
      // las acciones de mostrar/ocultar deben ejecutarse desde los controladores
      // (por ejemplo tras confirmar una reserva). Evitamos cambios inmediatos al cargar.

  // Cerrar modal de reserva de alojamiento
  const cerrarReservaAlojamiento = document.getElementById('cerrarReservaAlojamiento');
  if (cerrarReservaAlojamiento) {
    cerrarReservaAlojamiento.addEventListener('click', () => {
      document.getElementById('reservaAlojamiento').classList.add('hidden');
      document.getElementById('alojamientos').style.display = 'block';
    });
  }

  // Volver a alojamientos desde paso 1
  const volverAlojamientos = document.getElementById('volverAlojamientos');
  if (volverAlojamientos) {
    volverAlojamientos.addEventListener('click', () => {
      document.getElementById('reservaAlojamiento').classList.add('hidden');
      document.getElementById('alojamientos').style.display = 'block';
    });
  }

  // Cerrar confirmación de alojamiento
  const cerrarConfirmacionAlojamiento = document.getElementById('cerrarConfirmacionAlojamiento');
  const cerrarConfirmacionAlojamiento2 = document.getElementById('cerrarConfirmacionAlojamiento2');
  
  const cerrarConfirmacionAlojamientoFn = () => {
    // Ocultar modal de confirmación de alojamiento
    const confAlo = document.getElementById('confirmacionAlojamiento');
    if (confAlo) confAlo.classList.add('hidden');

    // Asegurar que el modal de reserva de alojamiento esté oculto
    const reservaAlo = document.getElementById('reservaAlojamiento');
    if (reservaAlo) reservaAlo.classList.add('hidden');

    // Mostrar la lista de alojamientos
    const alojEl = document.getElementById('alojamientos');
    if (alojEl) alojEl.style.display = 'block';

    // Resetear estado global de alojamiento
    try { window.accommodationData = {}; } catch (e) {}

    // Limpiar campos del modal de alojamiento
    const fechaIngresoEl = document.getElementById('fecha-ingreso'); if (fechaIngresoEl) fechaIngresoEl.value = '';
    const fechaSalidaEl = document.getElementById('fecha-salida'); if (fechaSalidaEl) fechaSalidaEl.value = '';
    const numeroHuespedesEl = document.getElementById('numero-huespedes'); if (numeroHuespedesEl) numeroHuespedesEl.value = '1';

    // Resetar pasos del flujo de alojamiento
    const paso1 = document.getElementById('paso-alojamiento-1'); if (paso1) paso1.classList.remove('hidden');
    const paso2 = document.getElementById('paso-alojamiento-2'); if (paso2) paso2.classList.add('hidden');

    // Limpiar textos de resumen
    const resumenNombre = document.getElementById('resumen-alojamiento-nombre'); if (resumenNombre) resumenNombre.textContent = '-';
    const resumenCheckIn = document.getElementById('resumen-check-in'); if (resumenCheckIn) resumenCheckIn.textContent = '-';
    const resumenCheckOut = document.getElementById('resumen-check-out'); if (resumenCheckOut) resumenCheckOut.textContent = '-';
    const resumenHuespedes = document.getElementById('resumen-huespedes'); if (resumenHuespedes) resumenHuespedes.textContent = '-';
    const resumenNoches = document.getElementById('resumen-noches-paso2'); if (resumenNoches) resumenNoches.textContent = '-';
    const resumenTotalAlo = document.getElementById('resumen-total-alojamiento'); if (resumenTotalAlo) resumenTotalAlo.textContent = '-';

    // Volver a renderizar alojamientos si es necesario (dejar interfaz usable)
    try { renderAccommodations(); } catch (e) {}
  };
  
  if (cerrarConfirmacionAlojamiento) {
    cerrarConfirmacionAlojamiento.addEventListener('click', cerrarConfirmacionAlojamientoFn);
  }
  if (cerrarConfirmacionAlojamiento2) {
    cerrarConfirmacionAlojamiento2.addEventListener('click', cerrarConfirmacionAlojamientoFn);
  }


  // Render inicial de alojamientos
  renderAccommodations();

  // Función para actualizar indicador de pasos
  function updateSteps(currentStep) {
    for (let i = 1; i <= 3; i++) {
      const step = document.getElementById(`step${i}`);
      const line = document.getElementById(`line${i}`);
      if (i <= currentStep) {
        step.classList.add('active');
        if (line) line.classList.add('active');
      } else {
        step.classList.remove('active');
        if (line) line.classList.remove('active');
      }
    }
  }
  } catch (err) {
    console.error('Error ejecutando FRONTEND/script.js:', err);
    // Mostrar tip de error en la UI si es posible
    try { alert('Error en la interfaz: ' + (err && err.message ? err.message : err)); } catch (e) { /* ignore */ }
  }
});
