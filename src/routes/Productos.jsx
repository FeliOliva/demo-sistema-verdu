import { useState } from 'react'
import { Plus } from 'lucide-react'
import { storage } from '../data/storage'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal, FormField } from '../components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table'
import { $ } from '../lib/utils'

export default function Productos() {
  const [productos, setProductos] = useState(() => storage.getProductos())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', medicion: '' })

  const reload   = () => setProductos(storage.getProductos())
  const openAdd  = () => { setEditing(null); setForm({ nombre: '', precio: '', medicion: '' }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ nombre: r.nombre, precio: String(r.precio), medicion: r.medicion }); setModalOpen(true) }

  const toggleEstado = (id, estadoActual) => {
    const updated = storage.getProductos().map(p => p.id === id ? { ...p, estado: estadoActual === 1 ? 0 : 1 } : p)
    storage.saveProductos(updated)
    reload()
  }

  const handleSave = () => {
    if (!form.nombre || !form.precio || !form.medicion) return
    const values = { nombre: form.nombre, precio: Number(form.precio), medicion: form.medicion }
    const all = storage.getProductos()
    const updated = editing
      ? all.map(p => p.id === editing.id ? { ...p, ...values } : p)
      : [...all, { id: storage.nextId('productos'), ...values, estado: 1 }]
    storage.saveProductos(updated)
    reload()
    setModalOpen(false)
  }

  const activos = productos.filter(p => p.estado !== 0)

  return (
    <section className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light">Productos</h1>
        <Button variant="teal" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <div className="rounded-[0.5rem] border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Medición</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activos.length === 0 && <TableEmpty colSpan={6} />}
            {activos.map(p => (
              <TableRow key={p.id}>
                <TableCell className="text-gray-400">{p.id}</TableCell>
                <TableCell className="font-medium">{p.nombre}</TableCell>
                <TableCell>{$(p.precio)}</TableCell>
                <TableCell>{p.medicion}</TableCell>
                <TableCell>
                  <Badge variant={p.estado === 1 ? 'success' : 'destructive'}>
                    {p.estado === 1 ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-xs text-bgheader hover:underline font-medium">Editar</button>
                  <button
                    onClick={() => toggleEstado(p.id, p.estado)}
                    className="bg-black hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                  >
                    {p.estado === 1 ? 'Desactivar' : 'Activar'}
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
        title={editing ? 'Editar producto' : 'Nuevo producto'}
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
        <FormField label="Precio ($)" required>
          <Input type="number" min={0} value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
        </FormField>
        <FormField label="Medición (u, kg, paq…)" required>
          <Input value={form.medicion} placeholder="u" onChange={e => setForm(f => ({ ...f, medicion: e.target.value }))} />
        </FormField>
      </Modal>
    </section>
  )
}
