import { useState } from 'react'
import { Plus } from 'lucide-react'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select, SelectOption } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { Modal, FormField } from '../components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'

export default function Negocios() {
  const [negocios,  setNegocios]  = useState(() => storage.getNegocios())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form, setForm] = useState({ nombre: '', direccion: '', clienteId: '' })

  const clientes = storage.getClientes().filter(c => c.estado !== 0)

  const reload   = () => setNegocios(storage.getNegocios())
  const openAdd  = () => { setEditing(null); setForm({ nombre: '', direccion: '', clienteId: '' }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ nombre: r.nombre, direccion: r.direccion || '', clienteId: String(r.clienteId) }); setModalOpen(true) }

  const toggleEstado = (id, estadoActual) => {
    const updated = storage.getNegocios().map(n => n.id === id ? { ...n, estado: estadoActual === 1 ? 0 : 1 } : n)
    storage.saveNegocios(updated)
    reload()
  }

  const handleSave = () => {
    if (!form.nombre || !form.clienteId) return
    const all = storage.getNegocios()
    const values = { ...form, clienteId: Number(form.clienteId) }
    const updated = editing
      ? all.map(n => n.id === editing.id ? { ...n, ...values } : n)
      : [...all, { id: storage.nextId('negocios'), ...values, estado: 1 }]
    storage.saveNegocios(updated)
    reload()
    setModalOpen(false)
  }

  const activos = negocios.filter(n => n.estado !== 0)

  return (
    <section className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light">Negocios</h1>
        <Button variant="teal" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Nuevo negocio
        </Button>
      </div>

      <div className="rounded-[0.5rem] border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activos.length === 0 && <TableEmpty colSpan={6} />}
            {activos.map(n => {
              const cliente = clientes.find(c => c.id === n.clienteId)
              return (
                <TableRow key={n.id}>
                  <TableCell className="text-gray-400">{n.id}</TableCell>
                  <TableCell className="font-medium">{n.nombre}</TableCell>
                  <TableCell>{n.direccion || '—'}</TableCell>
                  <TableCell>{cliente ? `${cliente.nombre} ${cliente.apellido}` : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={n.estado === 1 ? 'success' : 'destructive'}>
                      {n.estado === 1 ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <button onClick={() => openEdit(n)} className="text-xs text-bgheader hover:underline font-medium">Editar</button>
                    <button
                      onClick={() => toggleEstado(n.id, n.estado)}
                      className="bg-black hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                    >
                      {n.estado === 1 ? 'Desactivar' : 'Activar'}
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar negocio' : 'Nuevo negocio'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="teal" onClick={handleSave}>Guardar</Button>
          </>
        }
      >
        <FormField label="Cliente" required>
          <Select value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
            <SelectOption value="">Seleccioná un cliente</SelectOption>
            {clientes.map(c => (
              <SelectOption key={c.id} value={String(c.id)}>{c.nombre} {c.apellido}</SelectOption>
            ))}
          </Select>
        </FormField>
        <FormField label="Nombre del negocio" required>
          <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
        </FormField>
        <FormField label="Dirección">
          <Input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
        </FormField>
      </Modal>
    </section>
  )
}
