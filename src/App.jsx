import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './routes/Inicio'
import Clientes from './routes/Clientes'
import Negocios from './routes/Negocios'
import Productos from './routes/Productos'
import Ventas from './routes/Ventas'
import VentaDetalle from './routes/VentaDetalle'
import Pagos from './routes/Pagos'
import CuentaCorriente from './routes/CuentaCorriente'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                  element={<Inicio />} />
        <Route path="/clientes"          element={<Clientes />} />
        <Route path="/negocios"          element={<Negocios />} />
        <Route path="/productos"         element={<Productos />} />
        <Route path="/ventas"            element={<Ventas />} />
        <Route path="/ventas/:id"        element={<VentaDetalle />} />
        <Route path="/pagos"             element={<Pagos />} />
        <Route path="/cuenta-corriente"  element={<CuentaCorriente />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
