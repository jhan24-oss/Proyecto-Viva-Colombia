// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
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
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      authModal.classList.remove('hidden');
    });
  }
  
  if (authSubmit) {
    authSubmit.addEventListener('click', () => {
      alert('Sesión iniciada');
      authModal.classList.add('hidden');
    });
  }

  // Contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensaje enviado con éxito');
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

  const volverDestinos = document.getElementById('volverDestinos');
  if (volverDestinos) {
    volverDestinos.addEventListener('click', () => {
      document.getElementById('reserva').classList.add('hidden');
      document.getElementById('destinos').style.display = 'block';
    });
  }

  const volverPaso1 = document.getElementById('volverPaso1');
  if (volverPaso1) {
    volverPaso1.addEventListener('click', () => {
      document.getElementById('paso2').classList.add('hidden');
      document.getElementById('paso1').classList.remove('hidden');
      updateSteps(1);
    });
  }

  const volverPaso2 = document.getElementById('volverPaso2');
  if (volverPaso2) {
    volverPaso2.addEventListener('click', () => {
      document.getElementById('paso3').classList.add('hidden');
      document.getElementById('paso2').classList.remove('hidden');
      updateSteps(2);
    });
  }

  // Cerrar confirmación
  const cerrarConfirmacion = document.getElementById('cerrarConfirmacion');
  const cerrarConfirmacion2 = document.getElementById('cerrarConfirmacion2');
  
  const cerrarConfirmacionFn = () => {
    document.getElementById('confirmacion').classList.add('hidden');
    document.getElementById('destinos').style.display = 'block';
  };
  
  if (cerrarConfirmacion) {
    cerrarConfirmacion.addEventListener('click', cerrarConfirmacionFn);
  }
  if (cerrarConfirmacion2) {
    cerrarConfirmacion2.addEventListener('click', cerrarConfirmacionFn);
  }

  // --- Controladores para el modal de reservas de DESTINOS (pasos, continuar, confirmar, cerrar)
  const cerrarReserva = document.getElementById('cerrarReserva');
  if (cerrarReserva) {
    cerrarReserva.addEventListener('click', () => {
      document.getElementById('reserva').classList.add('hidden');
      document.getElementById('destinos').style.display = 'block';
      document.getElementById('alojamientos').style.display = 'block';
    });
  }

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

  const confirmarReservaBtn = document.getElementById('confirmarReserva');
  if (confirmarReservaBtn) {
    confirmarReservaBtn.addEventListener('click', () => {
      const pago = document.querySelector('input[name="pago"]:checked');
      if (!pago) {
        alert('Por favor selecciona un método de pago');
        return;
      }

      // Mostrar confirmación y resumir método de pago
      document.getElementById('reserva').classList.add('hidden');
      document.getElementById('confirmacion').classList.remove('hidden');
      const destinoName = document.getElementById('reserva-titulo')?.textContent || '';
      const totalText = document.getElementById('resumen-total')?.textContent || '';
      const pagoText = pago.value || (pago.closest('.payment-option')?.querySelector('.payment-text')?.textContent) || 'Método seleccionado';
      const msgEl = document.getElementById('confirmacion-mensaje');
      if (msgEl) msgEl.textContent = `Recibirás un correo con los detalles de tu viaje. ${destinoName} — ${totalText} • Pago: ${pagoText}`;
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
  const confirmarReservaAlojamientoBtn = document.getElementById('confirmarReservaAlojamiento');
  if (confirmarReservaAlojamientoBtn) {
    confirmarReservaAlojamientoBtn.addEventListener('click', () => {
      const pagoAlojamiento = document.querySelector('input[name="pago-alojamiento"]:checked');
      if (!pagoAlojamiento) {
        alert('Por favor selecciona un método de pago');
        return;
      }

      // Cerrar modal de reserva y mostrar confirmación
      document.getElementById('reservaAlojamiento').classList.add('hidden');
      document.getElementById('confirmacionAlojamiento').classList.remove('hidden');
    });
  }

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
    document.getElementById('confirmacionAlojamiento').classList.add('hidden');
    document.getElementById('alojamientos').style.display = 'block';
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

});

// (El control de apertura/flujo del modal de destinos se maneja dentro de DOMContentLoaded)

