import { storage } from './storage'

const d = (n) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - n)
  return dt.toISOString().split('T')[0]
}

export function seedDemoData() {
  if (storage.isInitialized()) return

  storage.setAll('metodoPago', [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Transferencia' },
    { id: 3, nombre: 'Cheque' },
    { id: 4, nombre: 'Tarjeta' },
  ])

  storage.setAll('clientes', [
    { id: 1,  nombre: 'Juan',      apellido: 'Pérez',     telefono: '351-555-0101', estado: 1 },
    { id: 2,  nombre: 'María',     apellido: 'González',  telefono: '341-555-0202', estado: 1 },
    { id: 3,  nombre: 'Roberto',   apellido: 'Silva',     telefono: '261-555-0303', estado: 1 },
    { id: 4,  nombre: 'Claudia',   apellido: 'Fernández', telefono: '381-555-0404', estado: 1 },
    { id: 5,  nombre: 'Marcelo',   apellido: 'Romero',    telefono: '299-555-0505', estado: 1 },
    { id: 6,  nombre: 'Patricia',  apellido: 'López',     telefono: '221-555-0606', estado: 1 },
    { id: 7,  nombre: 'Diego',     apellido: 'Torres',    telefono: '387-555-0707', estado: 1 },
    { id: 8,  nombre: 'Susana',    apellido: 'Martínez',  telefono: '358-555-0808', estado: 1 },
  ])

  storage.setAll('negocios', [
    { id: 1,  nombre: 'Almacén La Esquina',      direccion: 'Av. Colón 1234',          clienteId: 1, estado: 1 },
    { id: 2,  nombre: 'Kiosco El Centro',         direccion: 'San Martín 456',           clienteId: 1, estado: 1 },
    { id: 3,  nombre: 'Minimarket González',       direccion: 'Belgrano 789',             clienteId: 2, estado: 1 },
    { id: 4,  nombre: 'Despensa El Vecino',        direccion: 'Rivadavia 321',            clienteId: 3, estado: 1 },
    { id: 5,  nombre: 'Almacén Don Roberto',       direccion: 'Mitre 654',               clienteId: 3, estado: 1 },
    { id: 6,  nombre: 'Supermercado Fernández',    direccion: 'Corrientes 987',           clienteId: 4, estado: 1 },
    { id: 7,  nombre: 'Minimercado Norte',         direccion: 'Sarmiento 147',            clienteId: 5, estado: 1 },
    { id: 8,  nombre: 'Kiosco Romero',             direccion: 'Independencia 258',        clienteId: 5, estado: 1 },
    { id: 9,  nombre: 'Distribuidora López',       direccion: 'Libertad 369',             clienteId: 6, estado: 1 },
    { id: 10, nombre: 'Almacén Torres',            direccion: 'Moreno 741',               clienteId: 7, estado: 1 },
    { id: 11, nombre: 'Despensa Susana',           direccion: 'Urquiza 852',              clienteId: 8, estado: 1 },
  ])

  storage.setAll('productos', [
    { id: 1,  nombre: 'Papa',              precio: 850,   medicion: 'kg',    estado: 1 },
    { id: 2,  nombre: 'Bolsa de papa 5kg', precio: 3800,  medicion: 'bolsa', estado: 1 },
    { id: 3,  nombre: 'Cebolla',           precio: 620,   medicion: 'kg',    estado: 1 },
    { id: 4,  nombre: 'Cebolla bolsa 5kg', precio: 2800,  medicion: 'bolsa', estado: 1 },
    { id: 5,  nombre: 'Tomate',            precio: 1200,  medicion: 'kg',    estado: 1 },
    { id: 6,  nombre: 'Cajón de tomate',   precio: 14000, medicion: 'cajón', estado: 1 },
    { id: 7,  nombre: 'Lechuga',           precio: 900,   medicion: 'u',     estado: 1 },
    { id: 8,  nombre: 'Zanahoria',         precio: 550,   medicion: 'kg',    estado: 1 },
    { id: 9,  nombre: 'Zanahoria bolsa 3kg',precio: 1500, medicion: 'bolsa', estado: 1 },
    { id: 10, nombre: 'Zapallo',           precio: 480,   medicion: 'kg',    estado: 1 },
    { id: 11, nombre: 'Morrón rojo',       precio: 1800,  medicion: 'kg',    estado: 1 },
    { id: 12, nombre: 'Pepino',            precio: 750,   medicion: 'u',     estado: 1 },
    { id: 13, nombre: 'Limón',             precio: 900,   medicion: 'kg',    estado: 1 },
    { id: 14, nombre: 'Naranja',           precio: 650,   medicion: 'kg',    estado: 1 },
    { id: 15, nombre: 'Banana',            precio: 780,   medicion: 'kg',    estado: 1 },
  ])

  storage.setAll('ventas', [
    { id: 1,  nroVenta: 'V00001', clienteId: 1, negocioId: 1,  metodoPagoId: 1, fecha: d(88), total: 42400,  estado: 1 },
    { id: 2,  nroVenta: 'V00002', clienteId: 2, negocioId: 3,  metodoPagoId: 2, fecha: d(75), total: 30300,  estado: 1 },
    { id: 3,  nroVenta: 'V00003', clienteId: 3, negocioId: 4,  metodoPagoId: 1, fecha: d(66), total: 58400,  estado: 1 },
    { id: 4,  nroVenta: 'V00004', clienteId: 4, negocioId: 6,  metodoPagoId: 3, fecha: d(55), total: 29250,  estado: 1 },
    { id: 5,  nroVenta: 'V00005', clienteId: 1, negocioId: 2,  metodoPagoId: 2, fecha: d(48), total: 46600,  estado: 1 },
    { id: 6,  nroVenta: 'V00006', clienteId: 5, negocioId: 7,  metodoPagoId: 1, fecha: d(38), total: 34980,  estado: 1 },
    { id: 7,  nroVenta: 'V00007', clienteId: 3, negocioId: 5,  metodoPagoId: 2, fecha: d(30), total: 62000,  estado: 1 },
    { id: 8,  nroVenta: 'V00008', clienteId: 6, negocioId: 9,  metodoPagoId: 1, fecha: d(22), total: 40400,  estado: 1 },
    { id: 9,  nroVenta: 'V00009', clienteId: 2, negocioId: 3,  metodoPagoId: 2, fecha: d(14), total: 53300,  estado: 1 },
    { id: 10, nroVenta: 'V00010', clienteId: 7, negocioId: 10, metodoPagoId: 1, fecha: d(8),  total: 28740,  estado: 1 },
    { id: 11, nroVenta: 'V00011', clienteId: 8, negocioId: 11, metodoPagoId: 3, fecha: d(4),  total: 39500,  estado: 1 },
    { id: 12, nroVenta: 'V00012', clienteId: 4, negocioId: 6,  metodoPagoId: 2, fecha: d(1),  total: 42800,  estado: 1 },
  ])

  storage.setAll('detalleVentas', [
    // V1 - Papa + Cebolla + Tomate
    { id: 1,  venta_id: 1,  producto_id: 2,  cantidad: 6,  precio: 3800,  subTotal: 22800 },
    { id: 2,  venta_id: 1,  producto_id: 4,  cantidad: 4,  precio: 2800,  subTotal: 11200 },
    { id: 3,  venta_id: 1,  producto_id: 5,  cantidad: 7,  precio: 1200,  subTotal: 8400  },
    // V2 - Zanahoria + Lechuga + Tomate
    { id: 4,  venta_id: 2,  producto_id: 9,  cantidad: 5,  precio: 1500,  subTotal: 7500  },
    { id: 5,  venta_id: 2,  producto_id: 7,  cantidad: 12, precio: 900,   subTotal: 10800 },
    { id: 6,  venta_id: 2,  producto_id: 5,  cantidad: 10, precio: 1200,  subTotal: 12000 },
    // V3 - Papa + Zapallo + Morrón
    { id: 7,  venta_id: 3,  producto_id: 1,  cantidad: 20, precio: 850,   subTotal: 17000 },
    { id: 8,  venta_id: 3,  producto_id: 10, cantidad: 30, precio: 480,   subTotal: 14400 },
    { id: 9,  venta_id: 3,  producto_id: 11, cantidad: 15, precio: 1800,  subTotal: 27000 },
    // V4 - Naranja + Banana + Limón
    { id: 10, venta_id: 4,  producto_id: 14, cantidad: 15, precio: 650,   subTotal: 9750  },
    { id: 11, venta_id: 4,  producto_id: 15, cantidad: 10, precio: 780,   subTotal: 7800  },
    { id: 12, venta_id: 4,  producto_id: 13, cantidad: 13, precio: 900,   subTotal: 11700 },
    // V5 - Cajón de tomate + Bolsa de papa + Lechuga
    { id: 13, venta_id: 5,  producto_id: 6,  cantidad: 2,  precio: 14000, subTotal: 28000 },
    { id: 14, venta_id: 5,  producto_id: 2,  cantidad: 3,  precio: 3800,  subTotal: 11400 },
    { id: 15, venta_id: 5,  producto_id: 7,  cantidad: 8,  precio: 900,   subTotal: 7200  },
    // V6 - Papa + Cebolla + Zanahoria
    { id: 16, venta_id: 6,  producto_id: 1,  cantidad: 18, precio: 850,   subTotal: 15300 },
    { id: 17, venta_id: 6,  producto_id: 3,  cantidad: 14, precio: 620,   subTotal: 8680  },
    { id: 18, venta_id: 6,  producto_id: 8,  cantidad: 20, precio: 550,   subTotal: 11000 },
    // V7 - Cajón de tomate + Bolsa cebolla + Pepino
    { id: 19, venta_id: 7,  producto_id: 6,  cantidad: 3,  precio: 14000, subTotal: 42000 },
    { id: 20, venta_id: 7,  producto_id: 4,  cantidad: 5,  precio: 2800,  subTotal: 14000 },
    { id: 21, venta_id: 7,  producto_id: 12, cantidad: 8,  precio: 750,   subTotal: 6000  },
    // V8 - Papa + Tomate + Morrón
    { id: 22, venta_id: 8,  producto_id: 2,  cantidad: 4,  precio: 3800,  subTotal: 15200 },
    { id: 23, venta_id: 8,  producto_id: 5,  cantidad: 12, precio: 1200,  subTotal: 14400 },
    { id: 24, venta_id: 8,  producto_id: 11, cantidad: 6,  precio: 1800,  subTotal: 10800 },
    // V9 - Bolsa papa + Cajón tomate + Lechuga
    { id: 25, venta_id: 9,  producto_id: 2,  cantidad: 5,  precio: 3800,  subTotal: 19000 },
    { id: 26, venta_id: 9,  producto_id: 6,  cantidad: 2,  precio: 14000, subTotal: 28000 },
    { id: 27, venta_id: 9,  producto_id: 7,  cantidad: 7,  precio: 900,   subTotal: 6300  },
    // V10 - Zanahoria + Zapallo + Banana
    { id: 28, venta_id: 10, producto_id: 9,  cantidad: 6,  precio: 1500,  subTotal: 9000  },
    { id: 29, venta_id: 10, producto_id: 10, cantidad: 20, precio: 480,   subTotal: 9600  },
    { id: 30, venta_id: 10, producto_id: 15, cantidad: 13, precio: 780,   subTotal: 10140 },
    // V11 - Cebolla + Morrón + Pepino
    { id: 31, venta_id: 11, producto_id: 3,  cantidad: 25, precio: 620,   subTotal: 15500 },
    { id: 32, venta_id: 11, producto_id: 11, cantidad: 10, precio: 1800,  subTotal: 18000 },
    { id: 33, venta_id: 11, producto_id: 12, cantidad: 8,  precio: 750,   subTotal: 6000  },
    // V12 - Papa + Tomate + Naranja
    { id: 34, venta_id: 12, producto_id: 1,  cantidad: 20, precio: 850,   subTotal: 17000 },
    { id: 35, venta_id: 12, producto_id: 5,  cantidad: 15, precio: 1200,  subTotal: 18000 },
    { id: 36, venta_id: 12, producto_id: 14, cantidad: 12, precio: 650,   subTotal: 7800  },
  ])

  storage.setAll('entregas', [
    { id: 1,  nroEntrega: 'E001', clienteId: 1, negocioId: 1,  monto: 40000, metodoPagoId: 1, fecha: d(80), estado: 1 },
    { id: 2,  nroEntrega: 'E002', clienteId: 2, negocioId: 3,  monto: 30000, metodoPagoId: 2, fecha: d(70), estado: 1 },
    { id: 3,  nroEntrega: 'E003', clienteId: 3, negocioId: 4,  monto: 55000, metodoPagoId: 3, fecha: d(60), estado: 1 },
    { id: 4,  nroEntrega: 'E004', clienteId: 1, negocioId: 2,  monto: 45000, metodoPagoId: 2, fecha: d(45), estado: 1 },
    { id: 5,  nroEntrega: 'E005', clienteId: 4, negocioId: 6,  monto: 28000, metodoPagoId: 1, fecha: d(40), estado: 1 },
    { id: 6,  nroEntrega: 'E006', clienteId: 5, negocioId: 7,  monto: 35000, metodoPagoId: 2, fecha: d(32), estado: 1 },
    { id: 7,  nroEntrega: 'E007', clienteId: 3, negocioId: 5,  monto: 60000, metodoPagoId: 1, fecha: d(25), estado: 1 },
    { id: 8,  nroEntrega: 'E008', clienteId: 6, negocioId: 9,  monto: 38000, metodoPagoId: 3, fecha: d(18), estado: 1 },
    { id: 9,  nroEntrega: 'E009', clienteId: 2, negocioId: 3,  monto: 52000, metodoPagoId: 2, fecha: d(10), estado: 1 },
    { id: 10, nroEntrega: 'E010', clienteId: 7, negocioId: 10, monto: 27000, metodoPagoId: 1, fecha: d(5),  estado: 1 },
  ])

  storage.setCounter('clientes',      8)
  storage.setCounter('negocios',      11)
  storage.setCounter('productos',     15)
  storage.setCounter('ventas',        12)
  storage.setCounter('detalleVentas', 36)
  storage.setCounter('entregas',      10)

  storage.markInitialized()
}
