const P = 'mf_demo_'

const KEYS = {
  clientes:      `${P}clientes`,
  negocios:      `${P}negocios`,
  productos:     `${P}productos`,
  ventas:        `${P}ventas`,
  detalleVentas: `${P}detalle_ventas`,
  entregas:      `${P}entregas`,
  metodoPago:    `${P}metodo_pago`,
}

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function nextId(entity) {
  const k = `${P}ctr_${entity}`
  const n = parseInt(localStorage.getItem(k) || '0', 10) + 1
  localStorage.setItem(k, String(n))
  return n
}

function setCounter(entity, n) {
  localStorage.setItem(`${P}ctr_${entity}`, String(n))
}

export const storage = {
  getClientes:       () => load(KEYS.clientes),
  saveClientes:      (d) => save(KEYS.clientes, d),

  getNegocios:       () => load(KEYS.negocios),
  saveNegocios:      (d) => save(KEYS.negocios, d),

  getProductos:      () => load(KEYS.productos),
  saveProductos:     (d) => save(KEYS.productos, d),

  getVentas:         () => load(KEYS.ventas),
  saveVentas:        (d) => save(KEYS.ventas, d),

  getDetalleVentas:       () => load(KEYS.detalleVentas),
  getDetalleByVenta: (id) => load(KEYS.detalleVentas).filter(d => d.venta_id === id),
  saveDetalleVentas: (d)  => save(KEYS.detalleVentas, d),

  getEntregas:       () => load(KEYS.entregas),
  saveEntregas:      (d) => save(KEYS.entregas, d),

  getMetodoPago:     () => load(KEYS.metodoPago),

  nextId,
  setCounter,

  isInitialized:   () => localStorage.getItem(`${P}init`) === '1',
  markInitialized: () => localStorage.setItem(`${P}init`, '1'),

  resetAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(P))
      .forEach(k => localStorage.removeItem(k))
  },

  setAll: (key, data) => save(KEYS[key], data),
}
