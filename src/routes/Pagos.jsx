import { useState } from 'react'
import { Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select, SelectOption } from '../components/ui/Select'
import { Modal, FormField } from '../components/ui/Modal'
import { Card, CardContent } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'
import { $ } from '../lib/utils'

export default function Pagos() {
  const [pagos,     setPagos]     = useState(() => storage.getEntregas().filter(e => e.estado !== 0))
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ clienteId: '', negocioId: '', monto: '', metodoPagoId: '1', fecha: dayjs().format('YYYY-MM-DD') })

  const clientes = storage.getClientes().filter(c => c.estado !== 0)
  const negocios = storage.getNegocios().filter(n => n.estado !== 0)
  const metodos  = storage.getMetodoPago()

  const negociosFiltrados = form.clienteId
    ? negocios.filter(n => n.clienteId === Number(form.clienteId))
    : negocios

  const reload = () => setPagos(storage.getEntregas().filter(e => e.estado !== 0))

  const handleSave = () => {
    if (!form.clienteId || !form.negocioId || !form.monto) return
    const all = storage.getEntregas()
    const num = all.length + 1
    const newE = {
      id:           storage.nextId('entregas'),
      nroEntrega:   `E${String(num).padStart(3, '0')}`,
      clienteId:    Number(form.clienteId),
      negocioId:    Number(form.negocioId),
      monto:        Number(form.monto),
      metodoPagoId: Number(form.metodoPagoId),
      fecha:        form.fecha,
      estado:       1,
    }
    storage.saveEntregas([...all, newE])
    reload()
    setModalOpen(false)
    setForm({ clienteId: '', negocioId: '', monto: '', metodoPagoId: '1', fecha: dayjs().format('YYYY-MM-DD') })
  }

  const totalCobrado = pagos.reduce((s, p) => s + (p.monto || 0), 0)

  return (
    <section className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light">Pagos</h1>
        <Button variant="teal" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Registrar pago
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm text-gray-500">Total cobrado (registros activos)</p>
            <p className="text-2xl font-semibold text-green-700">{$(totalCobrado)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-[0.5rem] border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nro</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Negocio</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagos.length === 0 && <TableEmpty colSpan={6} />}
            {pagos.map(p => {
              const c = clientes.find(c => c.id === p.clienteId)
              const n = negocios.find(n => n.id === p.negocioId)
              const m = metodos.find(m => m.id === p.metodoPagoId)
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.nroEntrega}</TableCell>
                  <TableCell>{c ? `${c.nombre} ${c.apellido}` : '—'}</TableCell>
                  <TableCell>{n?.nombre ?? '—'}</TableCell>
                  <TableCell className="font-medium text-green-700">{$(p.monto)}</TableCell>
                  <TableCell>{m?.nombre ?? '—'}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar pago"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="teal" onClick={handleSave}>Guardar</Button>
          </>
        }
      >
        <FormField label="Cliente" required>
          <Select
            value={form.clienteId}
            onChange={e => setForm(f => ({ ...f, clienteId: e.target.value, negocioId: '' }))}
          >
            <SelectOption value="">Seleccioná un cliente</SelectOption>
            {clientes.map(c => (
              <SelectOption key={c.id} value={String(c.id)}>{c.nombre} {c.apellido}</SelectOption>
            ))}
          </Select>
        </FormField>
        <FormField label="Negocio" required>
          <Select value={form.negocioId} onChange={e => setForm(f => ({ ...f, negocioId: e.target.value }))}>
            <SelectOption value="">Seleccioná un negocio</SelectOption>
            {negociosFiltrados.map(n => (
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
