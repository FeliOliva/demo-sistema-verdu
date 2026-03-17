import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, ShoppingBasket, UserRound, Store, HandCoins } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import dayjs from 'dayjs'
import { storage } from '../data/storage'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { $  } from '../lib/utils'

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${color} bg-current/10`} style={{ background: 'hsl(197,66%,21%,0.1)' }}>
            <Icon className="h-5 w-5" style={{ color: 'hsl(197, 66%, 21%)' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Inicio() {
  const [desde, setDesde] = useState(dayjs().subtract(90, 'day').format('YYYY-MM-DD'))
  const [hasta, setHasta] = useState(dayjs().format('YYYY-MM-DD'))

  const stats = useMemo(() => {
    const ventas   = storage.getVentas()
    const pagos    = storage.getEntregas()
    const clientes = storage.getClientes().filter(c => c.estado !== 0)
    const negocios = storage.getNegocios().filter(n => n.estado !== 0)

    const inRange = (d) => d >= desde && d <= hasta

    const fv = ventas.filter(v  => v.estado !== 0 && inRange(v.fecha))
    const fp = pagos.filter(p   => p.estado !== 0 && inRange(p.fecha))

    const totalVentas  = fv.reduce((s, v) => s + (v.total || 0), 0)
    const totalCobrado = fp.reduce((s, p) => s + (p.monto || 0), 0)
    const saldo        = totalVentas - totalCobrado

    // Últimas 8 semanas
    const chartData = []
    for (let i = 7; i >= 0; i--) {
      const wStart = dayjs().subtract(i, 'week').startOf('week').format('YYYY-MM-DD')
      const wEnd   = dayjs().subtract(i, 'week').endOf('week').format('YYYY-MM-DD')
      const label  = dayjs().subtract(i, 'week').startOf('week').format('DD/MM')

      const wVentas = ventas.filter(v => v.estado !== 0 && v.fecha >= wStart && v.fecha <= wEnd)
      const wPagos  = pagos.filter(p  => p.estado !== 0 && p.fecha >= wStart && p.fecha <= wEnd)

      chartData.push({
        semana:  label,
        Ventas:  Math.round(wVentas.reduce((s, v) => s + (v.total || 0), 0)),
        Cobrado: Math.round(wPagos.reduce((s, p) => s + (p.monto || 0), 0)),
      })
    }

    return { totalVentas, totalCobrado, saldo, cantClientes: clientes.length, cantNegocios: negocios.length, cantVentas: fv.length, chartData }
  }, [desde, hasta])

  return (
    <section className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-light">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-500">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={e => setDesde(e.target.value)}
            className="h-8 rounded border border-border bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-bgheader"
          />
          <label className="text-gray-500">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={e => setHasta(e.target.value)}
            className="h-8 rounded border border-border bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-bgheader"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard title="Total Ventas"       value={$(stats.totalVentas)}  icon={TrendingUp}   color="text-blue-700" />
        <StatCard title="Total Cobrado"      value={$(stats.totalCobrado)} icon={HandCoins}    color="text-green-700" />
        <StatCard title="Saldo Pendiente"    value={$(stats.saldo)}        icon={TrendingDown} color={stats.saldo > 0 ? 'text-red-600' : 'text-green-700'} />
        <StatCard title="Ventas en período"  value={stats.cantVentas}      icon={ShoppingBasket} color="text-orange-600" />
        <StatCard title="Clientes Activos"   value={stats.cantClientes}    icon={UserRound}    color="text-teal-700" />
        <StatCard title="Negocios Activos"   value={stats.cantNegocios}    icon={Store}        color="text-purple-700" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ventas y Cobros — últimas 8 semanas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semana" tick={{ fontSize: 12, fontFamily: 'Montserrat' }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: 'Montserrat' }} />
              <Tooltip
                formatter={(v) => $(v)}
                contentStyle={{ fontFamily: 'Montserrat', fontSize: 13, borderRadius: 6 }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Montserrat', fontSize: 13 }} />
              <Bar dataKey="Ventas"  fill="hsl(197, 66%, 21%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Cobrado" fill="hsl(142, 70%, 45%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  )
}
