import { useEffect } from 'react'
import { prefetchRoute } from '../lib/route-preloader'

/**
 * Global pointer-lyssnare som prefetchar route-chunks innan användaren
 * faktiskt klickar. Lyssnar på pointerenter (mus/penna) och pointerdown
 * (touch) så att chunken hinner laddas medan tap-animationen spelas.
 *
 * Aktiveras genom att helt enkelt rendera en gång i App.tsx.
 */
export function LinkPrefetcher() {
  useEffect(() => {
    function getInternalHref(target: EventTarget | null): string | null {
      if (!(target instanceof Element)) return null
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return null
      const href = anchor.getAttribute('href')
      if (!href) return null
      if (anchor.target && anchor.target !== '_self') return null
      if (!href.startsWith('/') || href.startsWith('//')) return null
      const [pathname] = href.split('?')
      return pathname.split('#')[0] || null
    }

    let lastHovered: string | null = null

    function onPointerOver(e: PointerEvent) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      const path = getInternalHref(e.target)
      if (!path || path === lastHovered) return
      lastHovered = path
      prefetchRoute(path)
    }

    function onPointerDown(e: PointerEvent) {
      const path = getInternalHref(e.target)
      if (path) prefetchRoute(path)
    }

    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true, capture: true })

    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerdown', onPointerDown, { capture: true })
    }
  }, [])

  return null
}
