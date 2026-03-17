import { useState } from 'react'
import { Plus } from 'lucide-react'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Badge } from '../components/ui/Badge'
import { Modal, FormField } from '../components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'

export default function Clientes() {
  const [clientes,  setClientes]  = useState(() => storage.getClientes())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' })

  const reload   = () => setClientes(storage.getClientes())
  const openAdd  = () => { setEditing(null); setForm({ nombre: '', apellido: '', telefono: '' }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ nombre: r.nombre, apellido: r.apellido, telefono: r.telefono || '' }); setModalOpen(true) }

  const toggleEstado = (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1
    const updated = storage.getClientes().map(c => c.id === id ? { ...c, estado: nuevoEstado } : c)
    storage.saveClientes(updated)
    reload()
  }

  const handleSave = () => {
    if (!form.nombre || !form.apellido) return
    const all = storage.getClientes()
    let updated
    if (editing) {
      updated = all.map(c => c.id === editing.id ? { ...c, ...form } : c)
    } else {
      updated = [...all, { id: storage.nextId('clientes'), ...form, estado: 1 }]
    }
    storage.saveClientes(updated)
    reload()
    setModalOpen(false)
  }

  const activos = clientes.filter(c => c.estado !== 0)

  return (
    <section className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light">
          Estos son los clientes disponibles
        </h1>
        <Button variant="teal" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Nuevo cliente
        </Button>
      </div>

      <div className="rounded-[0.5rem] border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Negocios</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activos.length === 0 && <TableEmpty colSpan={7} />}
            {activos.map(c => (
              <TableRow key={c.id}>
                <TableCell className="text-gray-400">{c.id}</TableCell>
                <TableCell className="font-medium">{c.nombre}</TableCell>
                <TableCell>{c.apellido}</TableCell>
                <TableCell>{c.telefono || '—'}</TableCell>
                <TableCell>
                  <Badge variant={c.estado === 1 ? 'success' : 'destructive'}>
                    {c.estado === 1 ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {storage.getNegocios().filter(n => n.clienteId === c.id && n.estado !== 0).length}
                </TableCell>
                <TableCell className="flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-xs text-bgheader hover:underline font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleEstado(c.id, c.estado)}
                    className="bg-black hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                  >
                    {c.estado === 1 ? 'Desactivar' : 'Activar'}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="teal" onClick={handleSave}>Guardar</Button>
          </>
        }
      >
        <FormField label="Nombre" required>
          <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
        </FormField>
        <FormField label="Apellido" required>
          <Input value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} />
        </FormField>
        <FormField label="Teléfono">
          <Input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
        </FormField>
      </Modal>
    </section>
  )
}
