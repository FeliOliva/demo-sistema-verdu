import { useState, useMemo } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select, SelectOption } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'
import { $ } from '../lib/utils'

export default function VentaDetalle() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const ventaId  = parseInt(id, 10)

  const [venta, setVenta] = useState(() => storage.getVentas().find(v => v.id === ventaId))
  const [items, setItems] = useState(() => storage.getDetalleByVenta(ventaId))
  const [confirmDel, setConfirmDel] = useState(null)
  const [newProd,  setNewProd]  = useState('')
  const [newCant,  setNewCant]  = useState(1)
  const [newPrecio, setNewPrecio] = useState(0)

  const productos = storage.getProductos().filter(p => p.estado !== 0)
  const clientes  = storage.getClientes()
  const negocios  = storage.getNegocios()
  const metodos   = storage.getMetodoPago()

  const cliente = clientes.find(c => c.id === venta?.clienteId)
  const negocio = negocios.find(n => n.id === venta?.negocioId)
  const metodo  = metodos.find(m => m.id === venta?.metodoPagoId)

  const total = useMemo(() => items.reduce((s, i) => s + (i.subTotal || 0), 0), [items])

  const handleProductoSelect = (prodId) => {
    setNewProd(prodId)
    const prod = productos.find(p => p.id === Number(prodId))
    if (prod) setNewPrecio(prod.precio)
  }

  const persistTotal = (list) => {
    const t = list.reduce((s, i) => s + (i.subTotal || 0), 0)
    const updated = storage.getVentas().map(v => v.id === ventaId ? { ...v, total: t } : v)
    storage.saveVentas(updated)
    setVenta(prev => ({ ...prev, total: t }))
  }

  const handleAdd = () => {
    if (!newProd) return
    const item = {
      id:          storage.nextId('detalleVentas'),
      venta_id:    ventaId,
      producto_id: Number(newProd),
      cantidad:    newCant,
      precio:      newPrecio,
      subTotal:    newPrecio * newCant,
    }
    const newItems = [...items, item]
    storage.saveDetalleVentas([...storage.getDetalleVentas(), item])
    setItems(newItems)
    persistTotal(newItems)
    setNewProd('')
    setNewCant(1)
    setNewPrecio(0)
  }

  const handleDelete = (itemId) => {
    const newItems = items.filter(i => i.id !== itemId)
    storage.saveDetalleVentas(storage.getDetalleVentas().filter(d => d.id !== itemId))
    setItems(newItems)
    persistTotal(newItems)
    setConfirmDel(null)
  }

  if (!venta) return (
    <section className="container mx-auto py-6">
      <p className="text-gray-500">Venta no encontrada.</p>
    </section>
  )

  return (
    <section className="container mx-auto py-6 space-y-4">
      <Button variant="ghost" onClick={() => navigate('/ventas')}>
        <ArrowLeft className="h-4 w-4" /> Volver a Ventas
      </Button>

      {/* Info venta */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-mono">{venta.nroVenta}</CardTitle>
            <Badge variant={venta.estado !== 0 ? 'success' : 'destructive'}>
              {venta.estado !== 0 ? 'Activa' : 'Anulada'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-400 mb-0.5">Cliente</p>
              <p className="font-medium">{cliente ? `${cliente.nombre} ${cliente.apellido}` : '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Negocio</p>
              <p className="font-medium">{negocio?.nombre ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Método de Pago</p>
              <p className="font-medium">{metodo?.nombre ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Fecha</p>
              <p className="font-medium">{venta.fecha}</p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <p className="text-gray-400 mb-0.5">Total</p>
              <p className="text-2xl font-semibold" style={{ color: 'hsl(197, 66%, 21%)' }}>{$(total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos de la venta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Subtotal</TableHead>
                {venta.estado !== 0 && <TableHead></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && <TableEmpty colSpan={5} />}
              {items.map(item => {
                const prod = productos.find(p => p.id === item.producto_id)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{prod?.nombre ?? '—'}</TableCell>
                    <TableCell>{$(item.precio)}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell className="font-semibold">{$(item.subTotal)}</TableCell>
                    {venta.estado !== 0 && (
                      <TableCell>
                        <button onClick={() => setConfirmDel(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
              <TableRow>
                <td colSpan={3} className="px-4 py-3 text-right font-semibold text-sm">TOTAL</td>
                <td className="px-4 py-3 font-bold text-base" style={{ color: 'hsl(197, 66%, 21%)' }}>{$(total)}</td>
                {venta.estado !== 0 && <td />}
              </TableRow>
            </TableBody>
          </Table>

          {/* Agregar producto */}
          {venta.estado !== 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium mb-3">Agregar producto</p>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1 flex-1 min-w-48">
                  <Label>Producto</Label>
                  <Select value={newProd} onChange={e => handleProductoSelect(e.target.value)}>
                    <SelectOption value="">Seleccioná…</SelectOption>
                    {productos.map(p => (
                      <SelectOption key={p.id} value={String(p.id)}>
                        {p.nombre} ({p.medicion})
                      </SelectOption>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1 w-28">
                  <Label>Precio</Label>
                  <Input type="number" min={0} value={newPrecio} onChange={e => setNewPrecio(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1 w-24">
                  <Label>Cantidad</Label>
                  <Input type="number" min={1} value={newCant} onChange={e => setNewCant(parseInt(e.target.value) || 1)} />
                </div>
                <Button variant="teal" onClick={handleAdd} disabled={!newProd}>
                  <Plus className="h-4 w-4" /> Agregar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={confirmDel !== null}
        onClose={() => setConfirmDel(null)}
        title="¿Eliminar este producto?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => handleDelete(confirmDel)}>Eliminar</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Se eliminará el producto del detalle de la venta.</p>
      </Modal>
    </section>
  )
}
