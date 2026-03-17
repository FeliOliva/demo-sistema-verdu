import { useState, useEffect } from 'react'
import { Plus, X, Save, Eye, Ban } from 'lucide-react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Label } from '../components/ui/Label'
import { Input } from '../components/ui/Input'
import { Select, SelectOption } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'
import { $ } from '../lib/utils'

export default function Ventas() {
  const navigate = useNavigate()
  const [ventas, setVentas] = useState(() => storage.getVentas())
  const [confirmAnular, setConfirmAnular] = useState(null)

  // Form state — igual al VentaForm del proyecto real
  const [clienteSeleccionado,  setClienteSeleccionado]  = useState(null)
  const [negocioSeleccionado,  setNegocioSeleccionado]  = useState(null)
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')

  const clientes  = storage.getClientes().filter(c => c.estado !== 0)
  const negocios  = storage.getNegocios().filter(n => n.estado !== 0)
  const productos = storage.getProductos().filter(p => p.estado !== 0)
  const metodos   = storage.getMetodoPago()

  const negociosFiltrados = clienteSeleccionado
    ? negocios.filter(n => n.clienteId === Number(clienteSeleccionado))
    : []

  useEffect(() => { setNegocioSeleccionado(null) }, [clienteSeleccionado])

  const agregarDetalle = () => {
    setDetalles(d => [...d, { productoId: '', cantidad: 1, precio: 0 }])
  }

  const eliminarDetalle = (i) => setDetalles(d => d.filter((_, idx) => idx !== i))

  const actualizarDetalle = (i, campo, valor) => {
    setDetalles(d => d.map((item, idx) => idx === i ? { ...item, [campo]: valor } : item))
  }

  const seleccionarProducto = (i, prodId) => {
    const prod = productos.find(p => p.id === Number(prodId))
    if (prod) {
      setDetalles(d => d.map((item, idx) =>
        idx === i ? { ...item, productoId: prodId, precio: prod.precio, nombre: prod.nombre } : item
      ))
    }
  }

  const formatPrice = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

  const enviarVenta = () => {
    setError('')
    if (!clienteSeleccionado || !negocioSeleccionado) {
      setError('Seleccioná cliente y negocio')
      return
    }
    if (detalles.length === 0) {
      setError('Agregá al menos un producto')
      return
    }
    setGuardando(true)

    const all = storage.getVentas()
    const num = all.length + 1
    const total = detalles.reduce((s, d) => s + d.precio * d.cantidad, 0)
    const newV = {
      id:          storage.nextId('ventas'),
      nroVenta:    `V${String(num).padStart(5, '0')}`,
      clienteId:   Number(clienteSeleccionado),
      negocioId:   Number(negocioSeleccionado),
      metodoPagoId: metodoPagoSeleccionado ? Number(metodoPagoSeleccionado) : null,
      fecha:       dayjs().format('YYYY-MM-DD'),
      total,
      estado:      1,
    }

    const newDetalles = detalles.map((d, i) => ({
      id:          storage.nextId('detalleVentas'),
      venta_id:    newV.id,
      producto_id: Number(d.productoId),
      cantidad:    d.cantidad,
      precio:      d.precio,
      subTotal:    d.precio * d.cantidad,
    }))

    storage.saveVentas([...all, newV])
    storage.saveDetalleVentas([...storage.getDetalleVentas(), ...newDetalles])
    setVentas(storage.getVentas())

    setClienteSeleccionado(null)
    setNegocioSeleccionado(null)
    setMetodoPagoSeleccionado(null)
    setDetalles([])
    setGuardando(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const anularVenta = (id) => {
    const updated = storage.getVentas().map(v => v.id === id ? { ...v, estado: 0 } : v)
    storage.saveVentas(updated)
    setVentas(storage.getVentas())
    setConfirmAnular(null)
  }

  return (
    <section className="container mx-auto py-6 space-y-8">
      {/* Formulario — estilo idéntico al VentaForm del proyecto real */}
      <div>
        <h2 className="text-2xl font-light mb-4">Registrar nueva venta</h2>
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Registrar nueva venta</CardTitle>
            <CardDescription>Completá los datos para registrar una nueva venta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente <span className="text-red-500">*</span></Label>
              <Select
                id="cliente"
                value={clienteSeleccionado || ''}
                onChange={e => setClienteSeleccionado(e.target.value || null)}
              >
                <SelectOption value="">Seleccioná un cliente</SelectOption>
                {clientes.map(c => (
                  <SelectOption key={c.id} value={String(c.id)}>{c.nombre} {c.apellido}</SelectOption>
                ))}
              </Select>
            </div>

            {/* Negocio — solo si hay cliente */}
            {clienteSeleccionado && (
              <div className="space-y-2">
                <Label htmlFor="negocio">Negocio <span className="text-red-500">*</span></Label>
                <Select
                  id="negocio"
                  value={negocioSeleccionado || ''}
                  onChange={e => setNegocioSeleccionado(e.target.value || null)}
                >
                  <SelectOption value="">
                    {negociosFiltrados.length === 0 ? 'Este cliente no tiene negocios' : 'Seleccioná un negocio'}
                  </SelectOption>
                  {negociosFiltrados.map(n => (
                    <SelectOption key={n.id} value={String(n.id)}>{n.nombre}</SelectOption>
                  ))}
                </Select>
              </div>
            )}

            {/* Método de pago */}
            {clienteSeleccionado && (
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select
                  value={metodoPagoSeleccionado || ''}
                  onChange={e => setMetodoPagoSeleccionado(e.target.value || null)}
                >
                  <SelectOption value="">Seleccioná un método</SelectOption>
                  {metodos.map(m => (
                    <SelectOption key={m.id} value={String(m.id)}>{m.nombre}</SelectOption>
                  ))}
                </Select>
              </div>
            )}

            {/* Detalles — solo si hay negocio */}
            {negocioSeleccionado && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Productos <span className="text-red-500">*</span></Label>
                  <Button size="sm" variant="teal" onClick={agregarDetalle}>
                    <Plus className="h-4 w-4" /> Agregar producto
                  </Button>
                </div>

                {detalles.length === 0 && (
                  <p className="text-sm text-gray-500">No hay productos agregados a la venta</p>
                )}

                {detalles.map((detalle, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-[0.5rem] relative">
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded p-1 hover:bg-muted transition-colors"
                      onClick={() => eliminarDetalle(i)}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>

                    <div className="flex-1 space-y-1">
                      <Label>Producto</Label>
                      <Select
                        value={detalle.productoId}
                        onChange={e => seleccionarProducto(i, e.target.value)}
                      >
                        <SelectOption value="">Seleccioná un producto</SelectOption>
                        {productos.map(p => (
                          <SelectOption key={p.id} value={String(p.id)}>
                            {p.nombre} — {formatPrice(p.precio)}
                          </SelectOption>
                        ))}
                      </Select>
                    </div>

                    <div className="w-full md:w-24 space-y-1">
                      <Label>Cantidad</Label>
                      <Input
                        type="number" min="1"
                        value={detalle.cantidad}
                        onChange={e => actualizarDetalle(i, 'cantidad', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="w-full md:w-32 space-y-1">
                      <Label>Precio</Label>
                      <Input
                        type="number" min="0"
                        value={detalle.precio}
                        readOnly={!!detalle.productoId}
                        onChange={e => actualizarDetalle(i, 'precio', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="w-full md:w-32 space-y-1">
                      <Label>Total</Label>
                      <Input readOnly value={formatPrice(detalle.cantidad * detalle.precio)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-between">
            <div>
              {error   && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">Venta registrada con éxito</p>}
            </div>
            <Button
              variant="teal"
              onClick={enviarVenta}
              disabled={guardando || !clienteSeleccionado || !negocioSeleccionado || detalles.length === 0}
            >
              {guardando ? 'Registrando…' : <><Save className="h-4 w-4" /> Registrar venta</>}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabla de ventas */}
      <div>
        <h2 className="text-2xl font-light mb-4">Ventas registradas</h2>
        <div className="rounded-[0.5rem] border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nro</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Negocio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.length === 0 && <TableEmpty colSpan={7} />}
              {ventas.map(v => {
                const c = clientes.find(c => c.id === v.clienteId)
                const n = negocios.find(n => n.id === v.negocioId)
                return (
                  <TableRow key={v.id} className={v.estado === 0 ? 'opacity-50 line-through' : ''}>
                    <TableCell className="font-mono text-sm">{v.nroVenta}</TableCell>
                    <TableCell>{c ? `${c.nombre} ${c.apellido}` : '—'}</TableCell>
                    <TableCell>{n?.nombre ?? '—'}</TableCell>
                    <TableCell>{v.fecha}</TableCell>
                    <TableCell className="font-medium">{$(v.total)}</TableCell>
                    <TableCell>
                      <Badge variant={v.estado !== 0 ? 'success' : 'destructive'}>
                        {v.estado !== 0 ? 'Activa' : 'Anulada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/ventas/${v.id}`)}>
                        <Eye className="h-3.5 w-3.5" /> Ver
                      </Button>
                      {v.estado !== 0 && (
                        <Button size="sm" variant="destructive" onClick={() => setConfirmAnular(v.id)}>
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        open={confirmAnular !== null}
        onClose={() => setConfirmAnular(null)}
        title="¿Anular esta venta?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmAnular(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => anularVenta(confirmAnular)}>Anular</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Esta acción marcará la venta como anulada.</p>
      </Modal>
    </section>
  )
}
