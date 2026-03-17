import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  UserRound,
  Store,
  ShoppingBasket,
  CircleDollarSign,
  HandCoins,
  BookOpen,
  LogOut,
  Menu,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { storage } from '../data/storage'
import { seedDemoData } from '../data/seedData'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

const navItems = [
  { title: 'Inicio',           href: '/',                 icon: Home },
  { title: 'Clientes',         href: '/clientes',         icon: UserRound },
  { title: 'Negocios',         href: '/negocios',         icon: Store },
  { title: 'Productos',        href: '/productos',        icon: ShoppingBasket },
  { title: 'Ventas',           href: '/ventas',           icon: CircleDollarSign },
  { title: 'Pagos',            href: '/pagos',            icon: HandCoins },
  { title: 'Cuenta Corriente', href: '/cuenta-corriente', icon: BookOpen },
]

const pageTitles = {
  '/':                 'Inicio',
  '/clientes':         'Clientes',
  '/negocios':         'Negocios',
  '/productos':        'Productos',
  '/ventas':           'Ventas',
  '/pagos':            'Pagos',
  '/cuenta-corriente': 'Cuenta Corriente',
}

export default function Layout({ children }) {
  const [collapsed,    setCollapsed]    = useState(false)
  const [aviso,        setAviso]        = useState(true)
  const [confirmReset, setConfirmReset] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const activeHref = navItems.find(item =>
    location.pathname === item.href ||
    (item.href !== '/' && location.pathname.startsWith(item.href + '/'))
  )?.href ?? '/'

  const pageTitle = Object.entries(pageTitles).find(
    ([key]) => location.pathname === key || (key !== '/' && location.pathname.startsWith(key + '/'))
  )?.[1] ?? 'Mi Familia Verdulería'

  const handleReset = () => {
    storage.resetAll()
    seedDemoData()
    setConfirmReset(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <>
      {/* Aviso demo */}
      <Modal
        open={aviso}
        onClose={() => setAviso(false)}
        title={
          <span className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="h-4 w-4" />
            Aviso de demo
          </span>
        }
        footer={
          <Button variant="teal" onClick={() => setAviso(false)}>
            Entendido
          </Button>
        }
      >
        <p className="text-sm text-gray-700">
          Demo simplificada que representa el flujo básico del sistema.
        </p>
        <p className="text-sm text-gray-700">
          La versión completa incluye gestión avanzada, lógica de negocio y múltiples módulos
          no expuestos en esta demo.
        </p>
      </Modal>

      {/* Confirm reset */}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="¿Resetear demo?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReset}>Sí, resetear</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Se restaurarán los datos de ejemplo originales y se perderán los cambios realizados.
        </p>
      </Modal>

      <div className="flex h-screen overflow-hidden font-montserrat">
        {/* Sidebar */}
        <aside
          className={cn(
            'flex flex-col shrink-0 transition-[width] duration-200 ease-in-out overflow-hidden',
            'bg-sidebar text-white',
            collapsed ? 'w-16' : 'w-56'
          )}
        >
          {/* Brand */}
          <div
            className={cn(
              'flex items-center shrink-0 border-b border-white/10',
              collapsed ? 'justify-center px-0 py-5' : 'px-4 py-5 gap-2'
            )}
            style={{ backgroundColor: 'hsl(197, 66%, 21%)' }}
          >
            <ShoppingBasket className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-semibold leading-tight whitespace-nowrap overflow-hidden">
                Mi Familia Verdulería
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Menú
              </p>
            )}
            {navItems.map(({ title, href, icon: Icon }) => {
              const isActive = activeHref === href
              return (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className={cn(
                    'flex items-center w-full my-0.5 rounded transition-colors',
                    collapsed ? 'justify-center px-0 py-3 mx-0' : 'gap-3 px-4 py-2.5 mx-0',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                  title={collapsed ? title : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm whitespace-nowrap overflow-hidden">{title}</span>
                  )}
                  {!collapsed && isActive && (
                    <ChevronRight className="h-3 w-3 ml-auto text-white/60" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="shrink-0 border-t border-white/10 py-3">
            <button
              onClick={() => setConfirmReset(true)}
              className={cn(
                'flex items-center w-full py-2 rounded text-white/50 hover:bg-white/10 hover:text-white transition-colors',
                collapsed ? 'justify-center px-0' : 'gap-3 px-4'
              )}
              title={collapsed ? 'Resetear demo' : undefined}
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="text-xs">Resetear demo</span>}
            </button>
            <button
              className={cn(
                'flex items-center w-full py-2 rounded text-white/50 hover:bg-white/10 hover:text-white transition-colors',
                collapsed ? 'justify-center px-0' : 'gap-3 px-4'
              )}
              title={collapsed ? 'Cerrar sesión' : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="text-xs">Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex items-center gap-3 shrink-0 h-14 px-4 bg-white border-b border-border shadow-sm">
            <button
              onClick={() => setCollapsed(v => !v)}
              className="rounded p-1.5 hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-light text-gray-800">{pageTitle}</h1>
            <span className="ml-auto text-xs text-gray-400">
              Modo Demo — datos en memoria local del navegador
            </span>
          </header>

          <main className="flex-1 overflow-auto p-4 bg-background">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
