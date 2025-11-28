'use client'

// Sistema simple de idiomas para toda la app
// Idiomas soportados: español (es), inglés (en), hebreo (he)

export type Locale = 'es' | 'en' | 'he'

export const RTL_LOCALES: Locale[] = ['he']

export const DEFAULT_LOCALE: Locale = 'es'

const STORAGE_KEY = 'gentum_locale'

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && ['es', 'en', 'he'].includes(stored)) return stored
  return DEFAULT_LOCALE
}

export function saveLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, locale)
}

// Traducciones mínimas para probar el sistema en el Home y Header
const MESSAGES: Record<Locale, Record<string, string>> = {
  es: {
    // Header
    nav_experiences: 'Experiencias',
    nav_community: 'Comunidad',
    nav_groups: 'Grupos',
    nav_favorites: 'Favoritos',
    nav_challenges: 'Desafíos',
    nav_leaderboard: 'Ranking',
    nav_plans: 'Planes',
    nav_login: 'Ingresar',
    nav_search: 'Búsqueda',
    nav_messages: 'Mensajes',
    nav_notifications: 'Notificaciones',
    nav_language: 'Idioma:',
    lang_es: 'Español',
    lang_en: 'Inglés',
    lang_he: 'Hebreo',

    // Home
    home_experiences_title: 'Agenda curada en Buenos Aires',
    home_experiences_cta: 'Ver todas las experiencias →',
    home_how_it_works_title: 'Cómo funciona',
    home_how_it_works_step1_title: '1. Descubrí',
    home_how_it_works_step1_text: 'Explorá experiencias curadas en Buenos Aires, filtradas por tus intereses y fechas.',
    home_how_it_works_step2_title: '2. Conectá',
    home_how_it_works_step2_text: 'Unite a grupos existentes o creá el tuyo con cupos personalizados y coordinación simple.',
    home_how_it_works_step3_title: '3. Viví',
    home_how_it_works_step3_text: 'Disfrutá experiencias auténticas con anfitriones verificados y creá recuerdos únicos.',
    home_hero_logged_title: '¡Bienvenido de vuelta, {name}!',
    home_hero_logged_sub: 'Seguí explorando y ganá puntos',
    home_hero_points: 'Puntos',
    home_hero_level: 'Tu nivel',
    home_hero_streak: 'Días de racha',
    home_hero_go_dashboard: 'Ir al Dashboard',
    home_hero_explore_experiences: 'Explorar Experiencias',
    home_hero_guest_title: 'Descubrí Buenos Aires con la comunidad israelí que ya la vive',
    home_hero_guest_sub: 'Explorá actividades curadas, armá tu propio grupo y disfrutá experiencias auténticas con anfitriones bilingües.',
    home_hero_guest_cta_register: 'Crear cuenta gratis',
    home_hero_guest_cta_experiences: 'Ver experiencias',
    home_hero_guest_badge: '✓ +120 viajeros activos esta semana',
    premium_experiences_badge: 'EXPERIENCIAS PREMIUM',
    premium_experiences_title: 'Experiencias Gastronómicas Exclusivas',
    premium_experiences_subtitle: 'Las mejores experiencias culinarias curadas especialmente para vos, en tu idioma, con tu gente, y en los lugares más exclusivos de Buenos Aires.',
    premium_experiences_cta: 'Ver todas las experiencias premium →',
    home_experiences_havaia_title: 'Experiencias Havaia Exclusivas en Buenos Aires',
    home_experiences_havaia_subtitle: 'Todas las experiencias están pensadas, curadas y únicas, porque se diseñaron solo para vos y con quien quieras compartirla. Las experiencias havaia, solo las encontrás en havaia.',
    see_more: 'Ver más',
    table_seats: 'lugares',
    table_occupied: 'ocupados',
    table_available: 'disponibles',
  },
  en: {
    // Header
    nav_experiences: 'Experiences',
    nav_community: 'Community',
    nav_groups: 'Groups',
    nav_favorites: 'Favorites',
    nav_challenges: 'Challenges',
    nav_leaderboard: 'Ranking',
    nav_plans: 'Plans',
    nav_login: 'Sign in',
    nav_search: 'Search',
    nav_messages: 'Messages',
    nav_notifications: 'Notifications',
    nav_language: 'Language:',
    lang_es: 'Spanish',
    lang_en: 'English',
    lang_he: 'Hebrew',

    // Home
    home_experiences_title: 'Curated agenda in Buenos Aires',
    home_experiences_cta: 'See all experiences →',
    home_how_it_works_title: 'How it works',
    home_how_it_works_step1_title: '1. Discover',
    home_how_it_works_step1_text: 'Explore curated experiences in Buenos Aires, filtered by your interests and dates.',
    home_how_it_works_step2_title: '2. Connect',
    home_how_it_works_step2_text: 'Join existing groups or create your own with custom spots and simple coordination.',
    home_how_it_works_step3_title: '3. Live',
    home_how_it_works_step3_text: 'Enjoy authentic experiences with verified hosts and create unique memories.',
    home_hero_logged_title: 'Welcome back, {name}!',
    home_hero_logged_sub: 'Keep exploring and earn points',
    home_hero_points: 'Points',
    home_hero_level: 'Your level',
    home_hero_streak: 'Day streak',
    home_hero_go_dashboard: 'Go to Dashboard',
    home_hero_explore_experiences: 'Explore Experiences',
    home_hero_guest_title: 'Discover Buenos Aires with the Israeli community that already lives it',
    home_hero_guest_sub: 'Explore curated activities, create your own group and enjoy authentic experiences with bilingual hosts.',
    home_hero_guest_cta_register: 'Create free account',
    home_hero_guest_cta_experiences: 'See experiences',
    home_hero_guest_badge: '✓ 120+ active travelers this week',
    premium_experiences_badge: 'PREMIUM EXPERIENCES',
    premium_experiences_title: 'Exclusive Gastronomic Experiences',
    premium_experiences_subtitle: 'The best culinary experiences curated especially for you, in your language, with your people, and in the most exclusive places in Buenos Aires.',
    premium_experiences_cta: 'See all premium experiences →',
    home_experiences_havaia_title: 'Exclusive Havaia Experiences in Buenos Aires',
    home_experiences_havaia_subtitle: 'All experiences are thought, curated and unique, because they were designed just for you and with whoever you want to share them with. Havaia experiences, you only find them at havaia.',
    see_more: 'See more',
    table_seats: 'seats',
    table_occupied: 'occupied',
    table_available: 'available',
  },
  he: {
    // Header (hebreo, derecha a izquierda)
    nav_experiences: 'חוויות',
    nav_community: 'קהילה',
    nav_groups: 'קבוצות',
    nav_favorites: 'מועדפים',
    nav_challenges: 'אתגרים',
    nav_leaderboard: 'דירוג',
    nav_plans: 'תוכניות',
    nav_login: 'התחברות',
    nav_search: 'חיפוש',
    nav_messages: 'הודעות',
    nav_notifications: 'התראות',
    nav_language: 'שפה:',
    lang_es: 'ספרדית',
    lang_en: 'אנגלית',
    lang_he: 'עברית',

    // Home
    home_experiences_title: 'אוסף חוויות נבחרות בבואנוס איירס',
    home_experiences_cta: 'צפה בכל החוויות →',
    home_how_it_works_title: 'איך זה עובד',
    home_how_it_works_step1_title: '1. גילוי',
    home_how_it_works_step1_text: 'גלה חוויות נבחרות בבואנוס איירס, מסוננות לפי תחומי העניין והתאריכים שלך.',
    home_how_it_works_step2_title: '2. התחברות',
    home_how_it_works_step2_text: 'הצטרף לקבוצות קיימות או צור קבוצה משלך עם מספר משתתפים מותאם.',
    home_how_it_works_step3_title: '3. חוויה',
    home_how_it_works_step3_text: 'תהנה מחוויות אותנטיות עם מארחים מאומתים וצור זיכרונות מיוחדים.',
    home_hero_logged_title: 'ברוך שובך, {name}!',
    home_hero_logged_sub: 'המשך לגלות ולצבור נקודות',
    home_hero_points: 'נקודות',
    home_hero_level: 'הרמה שלך',
    home_hero_streak: 'ימים ברצף',
    home_hero_go_dashboard: 'ללוח הבקרה',
    home_hero_explore_experiences: 'לגלות חוויות',
    home_hero_guest_title: 'גלה את בואנוס איירס עם הקהילה הישראלית שכבר חיה אותה',
    home_hero_guest_sub: 'גלה פעילויות נבחרות, צור קבוצה משלך ותהנה מחוויות אותנטיות עם מארחים דוברי עברית.',
    home_hero_guest_cta_register: 'יצירת חשבון בחינם',
    home_hero_guest_cta_experiences: 'צפה בחוויות',
    home_hero_guest_badge: '✓ מעל 120 מטיילים פעילים השבוע',
    premium_experiences_badge: 'חוויות פרימיום',
    premium_experiences_title: 'חוויות גסטרונומיות בלעדיות',
    premium_experiences_subtitle: 'החוויות הקולינריות הטובות ביותר שנבחרו במיוחד עבורך, בשפה שלך, עם האנשים שלך, ובמקומות היוקרתיים ביותר בבואנוס איירס.',
    premium_experiences_cta: 'צפה בכל החוויות הפרימיום →',
    home_experiences_havaia_title: 'חוויות Havaia בלעדיות בבואנוס איירס',
    home_experiences_havaia_subtitle: 'כל החוויות נחשבות, נבחרות וייחודיות, כי הן תוכננו רק עבורך ועם מי שתרצה לחלוק אותן. חוויות havaia, אתה מוצא אותן רק ב-havaia.',
    see_more: 'ראה עוד',
    table_seats: 'מקומות',
    table_occupied: 'תפוסים',
    table_available: 'זמינים',
  },
}

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const dict = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE]
  let msg = dict[key] || key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      msg = msg.replace(`{${k}}`, String(v))
    })
  }
  return msg
}



