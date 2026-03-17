import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select, SelectOption } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { Modal, FormField } from '../components/ui/Modal'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'
import { $ } from '../lib/utils'

export default function CuentaCorriente() {
  const clientes = storage.getClientes().filter(c => c.estado !== 0)
  const negocios = storage.getNegocios().filter(n => n.estado !== 0)
  const metodos  = storage.getMetodoPago()

  const [clienteId, setClienteId] = useState('')
  const [pagos,     setPagos]     = useState(() => storage.getEntregas())
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ negocioId: '', monto: '', metodoPagoId: '1', fecha: dayjs().format('YYYY-MM-DD') })

  const ventas = storage.getVentas()
  const negociosPorCliente = clienteId ? negocios.filter(n => n.clienteId === Number(clienteId)) : []

  const { movimientos, totalVentas, totalCobrado, saldo } = useMemo(() => {
    if (!clienteId) return { movimientos: [], totalVentas: 0, totalCobrado: 0, saldo: 0 }
    const cid = Number(clienteId)

    const cv = ventas.filter(v => v.clienteId === cid && v.estado !== 0)
    const cp = pagos.filter(p  => p.clienteId === cid && p.estado !== 0)

    const movimientos = [
      ...cv.map(v => ({
        key:   `v-${v.id}`,
        tipo:  'Venta',
        ref:   `${v.nroVenta} — ${negocios.find(n => n.id === v.negocioId)?.nombre ?? ''}`,
        debe:  v.total,
        haber: 0,
        fecha: v.fecha,
      })),
      ...cp.map(p => ({
        key:   `p-${p.id}`,
        tipo:  'Pago',
        ref:   `${p.nroEntrega} — ${metodos.find(m => m.id === p.metodoPagoId)?.nombre ?? 'Efectivo'}`,
        debe:  0,
        haber: p.monto,
        fecha: p.fecha,
      })),
    ].sort((a, b) => a.fecha.localeCompare(b.fecha))

    const totalVentas  = cv.reduce((s, v) => s + (v.total || 0), 0)
    const totalCobrado = cp.reduce((s, p) => s + (p.monto || 0), 0)

    return { movimientos, totalVentas, totalCobrado, saldo: totalVentas - totalCobrado }
  }, [clienteId, pagos, ventas])

  const handleAddPago = () => {
    if (!form.negocioId || !form.monto) return
    const all = storage.getEntregas()
    const num = all.length + 1
    const newP = {
      id:           storage.nextId('entregas'),
      nroEntrega:   `E${String(num).padStart(3, '0')}`,
      clienteId:    Number(clienteId),
      negocioId:    Number(form.negocioId),
      monto:        Number(form.monto),
      metodoPagoId: Number(form.metodoPagoId),
      fecha:        form.fecha,
      estado:       1,
    }
    const updated = [...all, newP]
    storage.saveEntregas(updated)
    setPagos(updated)
    setModalOpen(false)
    setForm({ negocioId: '', monto: '', metodoPagoId: '1', fecha: dayjs().format('YYYY-MM-DD') })
  }

  const cliente = clientes.find(c => c.id === Number(clienteId))

  return (
    <section className="container mx-auto py-6 space-y-4">
      <h1 className="text-3xl font-light">Cuenta Corriente</h1>

      <Card>
        <CardContent className="pt-6 space-y-2">
          <label className="text-sm font-medium">Seleccioná un cliente</label>
          <Select
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            className="max-w-sm"
          >
            <SelectOption value="">Buscar cliente…</SelectOption>
            {clientes.map(c => (
              <SelectOption key={c.id} value={String(c.id)}>{c.nombre} {c.apellido}</SelectOption>
            ))}
          </Select>
        </CardContent>
      </Card>

      {clienteId && (
        <>
          {cliente && (
            <div className="rounded-[0.5rem] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 font-medium">
              {cliente.nombre} {cliente.apellido}
              {negociosPorCliente.length > 0 && (
                <span className="text-blue-600 font-normal ml-2">
                  · {negociosPorCliente.map(n => n.nombre).join(', ')}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Total Ventas</p>
                <p className="text-2xl font-semibold text-red-600">{$(totalVentas)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Total Cobrado</p>
                <p className="text-2xl font-semibold text-green-700">{$(totalCobrado)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Saldo Pendiente</p>
                <p className={`text-2xl font-semibold ${saldo > 0 ? 'text-red-600' : 'text-green-700'}`}>
                  {$(saldo)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Movimientos</CardTitle>
                <Button variant="teal" size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" /> Registrar pago
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Debe</TableHead>
                    <TableHead>Haber</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.length === 0 && <TableEmpty colSpan={5} message="Sin movimientos registrados" />}
                  {movimientos.map(m => (
                    <TableRow key={m.key}>
                      <TableCell>{m.fecha}</TableCell>
                      <TableCell>
                        <Badge variant={m.tipo === 'Venta' ? 'info' : 'success'}>{m.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{m.ref}</TableCell>
                      <TableCell>
                        {m.debe > 0
                          ? <span className="text-red-600 font-medium">{$(m.debe)}</span>
                          : <span className="text-gray-300">—</span>}
                      </TableCell>
                      <TableCell>
                        {m.haber > 0
                          ? <span className="text-green-700 font-medium">{$(m.haber)}</span>
                          : <span className="text-gray-300">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar pago"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="teal" onClick={handleAddPago}>Guardar</Button>
          </>
        }
      >
        <FormField label="Negocio" required>
          <Select value={form.negocioId} onChange={e => setForm(f => ({ ...f, negocioId: e.target.value }))}>
            <SelectOption value="">Seleccioná un negocio</SelectOption>
            {negociosPorCliente.map(n => (
              <SelectOption key={n.id} value={String(n.id)}>{n.nombre}</SelectOption>
            ))}
          </Select>
        </FormField>
        <FormField label="Monto ($)" required>
          <Input type="number" min={0} value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} />
        </FormField>
        <FormField label="Método de pago">
          <Select value={form.metodoPagoId} onChange={e => setForm(f => ({ ...f, metodoPagoId: e.target.value }))}>
            {metodos.map(m => <SelectOption key={m.id} value={String(m.id)}>{m.nombre}</SelectOption>)}
          </Select>
        </FormField>
        <FormField label="Fecha">
          <Input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
        </FormField>
      </Modal>
    </section>
  )
}
