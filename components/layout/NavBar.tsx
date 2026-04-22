'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Upload, History } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',        label: '儀表板', icon: Activity },
  { href: '/upload',  label: '上傳分析', icon: Upload },
  { href: '/history', label: '歷史紀錄', icon: History },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        background: 'oklch(1 0 0 / 0.88)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>⬡</span>
        <span
          className="font-display font-bold tracking-tight"
          style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}
        >
          InBody<span style={{ color: 'var(--color-primary)' }}>Tracker</span>
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                active ? '' : 'hover:bg-[var(--color-surface)]'
              )}
              style={
                active
                  ? {
                      background: 'var(--color-primary-dim)',
                      border: '1px solid var(--color-border-bright)',
                      color: 'var(--color-primary)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: 'var(--color-text-muted)',
                    }
              }
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
