/**
 * Centraliserat register av alla routes och deras lazy-importers.
 *
 * Används av:
 *  - App.tsx för att förladda alla chunks på idle efter inloggning
 *  - LinkPrefetch.tsx för att förladda en chunk när användaren hovrar
 *    eller pekar på en länk (innan klicket landar)
 */

type Importer = () => Promise<unknown>

interface RouteEntry {
  path: string
  /** Frivillig matchare för dynamiska segment, t.ex. /accounts/:id */
  match?: (pathname: string) => boolean
  load: Importer
}

const ROUTES: RouteEntry[] = [
  { path: '/home', load: () => import('../pages/Home') },
  { path: '/onboarding', load: () => import('../pages/Onboarding') },
  { path: '/profile', load: () => import('../pages/Profile') },
  { path: '/accounts', load: () => import('../pages/Accounts') },
  { path: '/invoices', load: () => import('../pages/Invoices') },
  { path: '/receipts', load: () => import('../pages/Receipts') },
  { path: '/connect-bank', load: () => import('../pages/ConnectBank') },
  { path: '/connect-bank/callback', load: () => import('../pages/ConnectBankCallback') },
  { path: '/accounts/stocks', load: () => import('../pages/StocksAndFunds') },
  { path: '/accounts/loans', load: () => import('../pages/Loans') },
  { path: '/connect-loans', load: () => import('../pages/ConnectLoans') },
  { path: '/accounts/assets', load: () => import('../pages/Assets') },
  { path: '/pension', load: () => import('../pages/Pension') },
  { path: '/pension/orange-kuvert', load: () => import('../pages/OrangeaKuvertet') },
  { path: '/pension/forsakringar', load: () => import('../pages/Pensionsforsakringar') },
  { path: '/abonnemang', load: () => import('../pages/Abonnemang') },
  { path: '/abonnemang/telia', load: () => import('../pages/TeliaKundkonto') },
  { path: '/abonnemang/telia/12gb', load: () => import('../pages/AbonnemangDetail') },
  { path: '/skatter', load: () => import('../pages/SkatterDeklaration') },
  { path: '/kuponger', load: () => import('../pages/Kuponger') },
  { path: '/cards', load: () => import('../pages/Cards') },
  { path: '/connect-cards', load: () => import('../pages/ConnectCards') },
  { path: '/offers', load: () => import('../pages/Offers') },
  { path: '/mailbox', load: () => import('../pages/Mailbox') },
  { path: '/settings', load: () => import('../pages/Settings') },
  { path: '/documents', load: () => import('../pages/Documents') },
  { path: '/documents/contracts', load: () => import('../pages/Contracts') },
  { path: '/documents/personal', load: () => import('../pages/PersonalDocuments') },
  { path: '/documents/grades', load: () => import('../pages/Grades') },
  { path: '/documents/ice', load: () => import('../pages/Ice') },
  { path: '/documents/health', load: () => import('../pages/Health') },
  { path: '/documents/school', load: () => import('../pages/School') },
  { path: '/documents/school/english-preschool', load: () => import('../pages/School') },
  { path: '/documents/school/english-preschool/agreements', load: () => import('../pages/EnglishPreschoolAgreements') },
  { path: '/properties', load: () => import('../pages/Properties') },
  { path: '/properties/inventories', load: () => import('../pages/Inventories') },
  { path: '/properties/inventories/big-chill', load: () => import('../pages/InventoryItemBigChill') },
  { path: '/properties/inventories/big-chill/receipt', load: () => import('../pages/InventoryReceipt') },
  { path: '/properties/inventories/big-chill/fault-report', load: () => import('../pages/InventoryFaultReport') },
  { path: '/properties/inventories/big-chill/receipt-offers', load: () => import('../pages/InventoryReceiptOffers') },
  { path: '/properties/vehicles', load: () => import('../pages/Vehicles') },
  { path: '/properties/vehicles/volvo-xc90', load: () => import('../pages/VehicleVolvoXC90') },
  { path: '/properties/boats', load: () => import('../pages/Boats') },
  { path: '/properties/boats/aquador-26ht', load: () => import('../pages/BoatAquador26HT') },
  { path: '/properties/insurances', load: () => import('../pages/Insurances') },
  { path: '/properties/insurances/home', load: () => import('../pages/HomeInsurance') },
  { path: '/connect-properties', load: () => import('../pages/ConnectProperties') },
  { path: '/property-home', load: () => import('../pages/PropertyHome') },
  { path: '/marketplace', load: () => import('../pages/Marketplace') },
  { path: '/requests', load: () => import('../pages/Requests') },
  { path: '/notifications', load: () => import('../pages/Notifications') },
  { path: '/network', load: () => import('../pages/Network') },

  {
    path: '/accounts/:id',
    match: (p) => /^\/accounts\/[^/]+$/.test(p) && !/^\/accounts\/(stocks|loans|assets)$/.test(p),
    load: () => import('../pages/PrivateAccount'),
  },
  {
    path: '/abonnemang/telia/kvitto/:id',
    match: (p) => /^\/abonnemang\/telia\/kvitto\/[^/]+$/.test(p),
    load: () => import('../pages/AbonnemangKvitto'),
  },
  {
    path: '/abonnemang/:id',
    match: (p) => /^\/abonnemang\/[^/]+$/.test(p) && !/^\/abonnemang\/telia$/.test(p),
    load: () => import('../pages/AbonnemangProviderPlaceholder'),
  },
  {
    path: '/skatter/deklaration/:id',
    match: (p) => /^\/skatter\/deklaration\/[^/]+$/.test(p),
    load: () => import('../pages/DeklarationDetail'),
  },
  {
    path: '/user/:id',
    match: (p) => /^\/user\/[^/]+$/.test(p),
    load: () => import('../pages/UserProfile'),
  },
]

const loaded = new WeakSet<Importer>()

function loadOnce(importer: Importer) {
  if (loaded.has(importer)) return
  loaded.add(importer)
  importer().catch(() => loaded.delete(importer))
}

type IdleCallback = (cb: () => void) => void

function getIdleScheduler(): IdleCallback {
  const win = window as unknown as { requestIdleCallback?: IdleCallback }
  return win.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 1))
}

/**
 * Förladda alla rutter på idle. Anropas en gång efter inloggning.
 * Sprids ut över flera idle-tickar så vi inte blockerar huvudtråden.
 */
export function preloadAllRoutes() {
  const schedule = getIdleScheduler()
  ROUTES.forEach((route, i) => {
    schedule(() => {
      window.setTimeout(() => loadOnce(route.load), i * 30)
    })
  })
}

/**
 * Förladda chunken som matchar en given pathname. Anropas på hover/pointerdown
 * från `<Link>`-wrappers så att chunken är klar innan klicket landar.
 */
export function prefetchRoute(pathname: string) {
  if (!pathname || !pathname.startsWith('/')) return
  const match =
    ROUTES.find((r) => r.path === pathname) ??
    ROUTES.find((r) => r.match?.(pathname))
  if (match) loadOnce(match.load)
}
