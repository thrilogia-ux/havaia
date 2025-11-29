// Traducciones para los datos de las experiencias
import { type Locale } from './i18n'

// Mapeo de categorías a traducciones
export const categoryTranslations: Record<string, Record<Locale, string>> = {
  'Gastronomía': {
    es: 'Gastronomía',
    en: 'Gastronomy',
    he: 'גסטרונומיה'
  },
  'Cultura': {
    es: 'Cultura',
    en: 'Culture',
    he: 'תרבות'
  },
  'Vida Nocturna': {
    es: 'Vida Nocturna',
    en: 'Nightlife',
    he: 'חיי לילה'
  },
  'Aventura': {
    es: 'Aventura',
    en: 'Adventure',
    he: 'הרפתקה'
  }
}

export interface ExperienceTranslations {
  title: string
  description: string
  itinerary: string[]
  includes: string[]
  notIncludes: string[]
}

export interface PremiumExperienceTranslations {
  title: string
  description: string
  includes: string[]
  highlights: string[]
}

// Traducciones para experiencias regulares
export const experienceTranslations: Record<number, Record<Locale, ExperienceTranslations>> = {
  1: {
    es: {
      title: 'Tour Gastronómico Kosher en Palermo',
      description: 'Un recorrido único por los mejores restaurantes kosher de Palermo, combinando sabores tradicionales argentinos con la cocina judía. Incluye degustaciones, historias de la comunidad y encuentros con chefs locales.',
      itinerary: [
        '19:00 - Encuentro en punto de partida',
        '19:15 - Primera parada: Restaurante La Crespo',
        '20:30 - Segunda parada: Patisserie kosher',
        '21:30 - Tercera parada: Cena completa',
        '22:00 - Cierre con café y charla'
      ],
      includes: [
        'Degustaciones en 3 restaurantes',
        'Guía bilingüe (hebreo/español)',
        'Agua y bebidas incluidas',
        'Material informativo'
      ],
      notIncludes: [
        'Transporte al punto de encuentro',
        'Propinas',
        'Bebidas alcohólicas adicionales'
      ]
    },
    en: {
      title: 'Kosher Gastronomic Tour in Palermo',
      description: 'A unique tour of the best kosher restaurants in Palermo, combining traditional Argentine flavors with Jewish cuisine. Includes tastings, community stories and meetings with local chefs.',
      itinerary: [
        '7:00 PM - Meeting at starting point',
        '7:15 PM - First stop: La Crespo Restaurant',
        '8:30 PM - Second stop: Kosher Patisserie',
        '9:30 PM - Third stop: Full dinner',
        '10:00 PM - Closing with coffee and chat'
      ],
      includes: [
        'Tastings at 3 restaurants',
        'Bilingual guide (Hebrew/Spanish)',
        'Water and drinks included',
        'Informative material'
      ],
      notIncludes: [
        'Transportation to meeting point',
        'Tips',
        'Additional alcoholic beverages'
      ]
    },
    he: {
      title: 'סיור גסטרונומי כשר בפלרמו',
      description: 'סיור ייחודי במסעדות הכשרות הטובות ביותר בפלרמו, המשלב טעמים ארגנטינאים מסורתיים עם המטבח היהודי. כולל טעימות, סיפורי קהילה ומפגשים עם שפים מקומיים.',
      itinerary: [
        '19:00 - מפגש בנקודת המוצא',
        '19:15 - תחנה ראשונה: מסעדת La Crespo',
        '20:30 - תחנה שנייה: פטיסרי כשר',
        '21:30 - תחנה שלישית: ארוחת ערב מלאה',
        '22:00 - סיום עם קפה ושיחה'
      ],
      includes: [
        'טעימות ב-3 מסעדות',
        'מדריך דו-לשוני (עברית/ספרדית)',
        'מים ומשקאות כלולים',
        'חומר אינפורמטיבי'
      ],
      notIncludes: [
        'תחבורה לנקודת המפגש',
        'טיפים',
        'משקאות אלכוהוליים נוספים'
      ]
    }
  },
  2: {
    es: {
      title: 'Tango Show y Clase en San Telmo',
      description: 'Viví una experiencia auténtica de tango argentino con show en vivo y clase básica. Perfecto para principiantes y amantes de la cultura porteña.',
      itinerary: [
        '20:00 - Encuentro en milonga',
        '20:15 - Show de tango profesional',
        '21:00 - Clase básica de tango',
        '21:45 - Práctica libre',
        '22:30 - Cierre'
      ],
      includes: [
        'Show de tango',
        'Clase de baile',
        'Bebida de bienvenida',
        'Guía bilingüe'
      ],
      notIncludes: [
        'Transporte',
        'Cena'
      ]
    },
    en: {
      title: 'Tango Show and Class in San Telmo',
      description: 'Experience an authentic Argentine tango experience with live show and basic class. Perfect for beginners and lovers of porteño culture.',
      itinerary: [
        '8:00 PM - Meeting at milonga',
        '8:15 PM - Professional tango show',
        '9:00 PM - Basic tango class',
        '9:45 PM - Free practice',
        '10:30 PM - Closing'
      ],
      includes: [
        'Tango show',
        'Dance class',
        'Welcome drink',
        'Bilingual guide'
      ],
      notIncludes: [
        'Transportation',
        'Dinner'
      ]
    },
    he: {
      title: 'מופע טנגו ושיעור בסן טלמו',
      description: 'חווה חוויה אותנטית של טנגו ארגנטינאי עם מופע חי ושיעור בסיסי. מושלם למתחילים ואוהבי תרבות הפורטיניו.',
      itinerary: [
        '20:00 - מפגש במילונגה',
        '20:15 - מופע טנגו מקצועי',
        '21:00 - שיעור טנגו בסיסי',
        '21:45 - תרגול חופשי',
        '22:30 - סיום'
      ],
      includes: [
        'מופע טנגו',
        'שיעור ריקוד',
        'משקה ברכה',
        'מדריך דו-לשוני'
      ],
      notIncludes: [
        'תחבורה',
        'ארוחת ערב'
      ]
    }
  },
  3: {
    es: {
      title: 'Nightlife Segura: Bares y Vida Nocturna',
      description: 'Recorrido por los mejores bares y lugares nocturnos de Buenos Aires, con guía que conoce la escena local y garantiza una experiencia segura.',
      itinerary: [
        '22:00 - Encuentro en primer bar',
        '22:30 - Segundo bar',
        '23:30 - Tercer bar',
        '00:30 - Cuarto destino',
        '02:00 - Cierre'
      ],
      includes: [
        'Entrada a 4 lugares',
        'Primera ronda de bebidas',
        'Guía bilingüe',
        'Coordinación de transporte'
      ],
      notIncludes: [
        'Bebidas adicionales',
        'Transporte entre lugares'
      ]
    },
    en: {
      title: 'Safe Nightlife: Bars and Nightlife',
      description: 'Tour of the best bars and nightlife venues in Buenos Aires, with a guide who knows the local scene and ensures a safe experience.',
      itinerary: [
        '10:00 PM - Meeting at first bar',
        '10:30 PM - Second bar',
        '11:30 PM - Third bar',
        '12:30 AM - Fourth destination',
        '2:00 AM - Closing'
      ],
      includes: [
        'Entry to 4 venues',
        'First round of drinks',
        'Bilingual guide',
        'Transportation coordination'
      ],
      notIncludes: [
        'Additional drinks',
        'Transportation between venues'
      ]
    },
    he: {
      title: 'חיי לילה בטוחים: ברים וחיי לילה',
      description: 'סיור בפאבים ומקומות הלילה הטובים ביותר בבואנוס איירס, עם מדריך שמכיר את הסצנה המקומית ומבטיח חוויה בטוחה.',
      itinerary: [
        '22:00 - מפגש בבר הראשון',
        '22:30 - בר שני',
        '23:30 - בר שלישי',
        '00:30 - יעד רביעי',
        '02:00 - סיום'
      ],
      includes: [
        'כניסה ל-4 מקומות',
        'סיבוב ראשון של משקאות',
        'מדריך דו-לשוני',
        'תיאום תחבורה'
      ],
      notIncludes: [
        'משקאות נוספים',
        'תחבורה בין מקומות'
      ]
    }
  },
  4: {
    es: {
      title: 'Escape a Tigre: Delta y Naturaleza',
      description: 'Excursión de día completo al Delta del Tigre, navegando por los canales, disfrutando de la naturaleza y la gastronomía local.',
      itinerary: [
        '09:00 - Salida desde Buenos Aires',
        '10:30 - Llegada a Tigre',
        '11:00 - Navegación por canales',
        '13:00 - Almuerzo en isla',
        '15:00 - Actividades recreativas',
        '17:00 - Regreso',
        '19:00 - Llegada a Buenos Aires'
      ],
      includes: [
        'Transporte ida y vuelta',
        'Navegación por delta',
        'Almuerzo',
        'Guía bilingüe',
        'Seguro'
      ],
      notIncludes: [
        'Bebidas adicionales',
        'Actividades opcionales'
      ]
    },
    en: {
      title: 'Escape to Tigre: Delta and Nature',
      description: 'Full day excursion to the Tigre Delta, navigating the channels, enjoying nature and local gastronomy.',
      itinerary: [
        '9:00 AM - Departure from Buenos Aires',
        '10:30 AM - Arrival in Tigre',
        '11:00 AM - Channel navigation',
        '1:00 PM - Lunch on island',
        '3:00 PM - Recreational activities',
        '5:00 PM - Return',
        '7:00 PM - Arrival in Buenos Aires'
      ],
      includes: [
        'Round trip transportation',
        'Delta navigation',
        'Lunch',
        'Bilingual guide',
        'Insurance'
      ],
      notIncludes: [
        'Additional drinks',
        'Optional activities'
      ]
    },
    he: {
      title: 'בריחה לטיגרה: דלתא וטבע',
      description: 'טיול יום מלא לדלתא טיגרה, ניווט בתעלות, הנאה מהטבע והגסטרונומיה המקומית.',
      itinerary: [
        '09:00 - יציאה מבואנוס איירס',
        '10:30 - הגעה לטיגרה',
        '11:00 - ניווט בתעלות',
        '13:00 - ארוחת צהריים באי',
        '15:00 - פעילויות פנאי',
        '17:00 - חזרה',
        '19:00 - הגעה לבואנוס איירס'
      ],
      includes: [
        'תחבורה הלוך ושוב',
        'ניווט בדלתא',
        'ארוחת צהריים',
        'מדריך דו-לשוני',
        'ביטוח'
      ],
      notIncludes: [
        'משקאות נוספים',
        'פעילויות אופציונליות'
      ]
    }
  },
  5: {
    es: {
      title: 'Tour Histórico: Barrios Judíos de Buenos Aires',
      description: 'Recorrido histórico por los barrios donde se asentó la comunidad judía en Buenos Aires, conociendo sinagogas, instituciones y la historia de la inmigración.',
      itinerary: [
        '10:00 - Encuentro en Villa Crespo',
        '10:30 - Sinagoga principal',
        '11:30 - Barrio de Once',
        '12:30 - Museo de la Inmigración',
        '13:00 - Cierre con charla'
      ],
      includes: [
        'Guía especializado',
        'Entradas a museos',
        'Material informativo',
        'Agua'
      ],
      notIncludes: [
        'Transporte',
        'Almuerzo'
      ]
    },
    en: {
      title: 'Historical Tour: Jewish Neighborhoods of Buenos Aires',
      description: 'Historical tour of the neighborhoods where the Jewish community settled in Buenos Aires, visiting synagogues, institutions and learning about immigration history.',
      itinerary: [
        '10:00 AM - Meeting in Villa Crespo',
        '10:30 AM - Main synagogue',
        '11:30 AM - Once neighborhood',
        '12:30 PM - Immigration Museum',
        '1:00 PM - Closing with talk'
      ],
      includes: [
        'Specialized guide',
        'Museum entries',
        'Informative material',
        'Water'
      ],
      notIncludes: [
        'Transportation',
        'Lunch'
      ]
    },
    he: {
      title: 'סיור היסטורי: שכונות יהודיות בבואנוס איירס',
      description: 'סיור היסטורי בשכונות שבהן התיישבה הקהילה היהודית בבואנוס איירס, הכרת בתי כנסת, מוסדות והיסטוריית ההגירה.',
      itinerary: [
        '10:00 - מפגש בווילה קרספו',
        '10:30 - בית כנסת ראשי',
        '11:30 - שכונת אונסה',
        '12:30 - מוזיאון ההגירה',
        '13:00 - סיום עם שיחה'
      ],
      includes: [
        'מדריך מומחה',
        'כניסות למוזיאונים',
        'חומר אינפורמטיבי',
        'מים'
      ],
      notIncludes: [
        'תחבורה',
        'ארוחת צהריים'
      ]
    }
  },
  6: {
    es: {
      title: 'Cooking Class: Cocina Argentina Kosher',
      description: 'Aprendé a cocinar platos típicos argentinos adaptados a la cocina kosher. Clase práctica con chef profesional.',
      itinerary: [
        '18:00 - Bienvenida y presentación',
        '18:15 - Preparación de ingredientes',
        '18:45 - Cocción de platos',
        '20:00 - Degustación',
        '21:00 - Cierre y recetas'
      ],
      includes: [
        'Clase de cocina',
        'Ingredientes',
        'Degustación completa',
        'Recetario digital',
        'Guía bilingüe'
      ],
      notIncludes: [
        'Transporte',
        'Bebidas alcohólicas'
      ]
    },
    en: {
      title: 'Cooking Class: Kosher Argentine Cuisine',
      description: 'Learn to cook typical Argentine dishes adapted to kosher cuisine. Practical class with professional chef.',
      itinerary: [
        '6:00 PM - Welcome and presentation',
        '6:15 PM - Ingredient preparation',
        '6:45 PM - Cooking dishes',
        '8:00 PM - Tasting',
        '9:00 PM - Closing and recipes'
      ],
      includes: [
        'Cooking class',
        'Ingredients',
        'Full tasting',
        'Digital recipe book',
        'Bilingual guide'
      ],
      notIncludes: [
        'Transportation',
        'Alcoholic beverages'
      ]
    },
    he: {
      title: 'שיעור בישול: מטבח ארגנטינאי כשר',
      description: 'למד לבשל מנות ארגנטינאיות טיפוסיות מותאמות למטבח כשר. שיעור מעשי עם שף מקצועי.',
      itinerary: [
        '18:00 - ברכה והצגה',
        '18:15 - הכנת מרכיבים',
        '18:45 - בישול מנות',
        '20:00 - טעימה',
        '21:00 - סיום ומתכונים'
      ],
      includes: [
        'שיעור בישול',
        'מרכיבים',
        'טעימה מלאה',
        'ספר מתכונים דיגיטלי',
        'מדריך דו-לשוני'
      ],
      notIncludes: [
        'תחבורה',
        'משקאות אלכוהוליים'
      ]
    }
  }
}

// Traducciones para experiencias premium
export const premiumExperienceTranslations: Record<number, Record<Locale, PremiumExperienceTranslations>> = {
  1: {
    es: {
      title: 'Experiencia Don Julio',
      description: 'Una experiencia gastronómica de alto nivel en la mejor parrilla del mundo. Mesa especialmente reservada para 10 personas. Conocé a otros viajeros o simplemente disfrutá de una cena exclusiva.',
      includes: [
        'Cena completa de 7 pasos',
        'Selección de vinos premium',
        'Mesa exclusiva reservada',
        'Servicio de sommelier',
        'Propina incluida (opcional)'
      ],
      highlights: [
        'Mejor parrilla del mundo según The World\'s 50 Best Restaurants',
        'Ambiente exclusivo y elegante',
        'Oportunidad de conocer a otros viajeros'
      ]
    },
    en: {
      title: 'Don Julio Experience',
      description: 'A high-end gastronomic experience at the best grill in the world. Specially reserved table for 10 people. Meet other travelers or simply enjoy an exclusive dinner.',
      includes: [
        'Full 7-course dinner',
        'Premium wine selection',
        'Exclusively reserved table',
        'Sommelier service',
        'Tip included (optional)'
      ],
      highlights: [
        'Best grill in the world according to The World\'s 50 Best Restaurants',
        'Exclusive and elegant atmosphere',
        'Opportunity to meet other travelers'
      ]
    },
    he: {
      title: 'חווית Don Julio',
      description: 'חוויה גסטרונומית ברמה גבוהה במסעדת הגריל הטובה ביותר בעולם. שולחן שמור במיוחד ל-10 אנשים. פגש מטיילים אחרים או פשוט תהנה מארוחת ערב בלעדית.',
      includes: [
        'ארוחת ערב מלאה של 7 מנות',
        'בחירת יינות פרימיום',
        'שולחן שמור בלעדית',
        'שירות סומלייה',
        'טיפ כלול (אופציונלי)'
      ],
      highlights: [
        'הגריל הטוב ביותר בעולם לפי The World\'s 50 Best Restaurants',
        'אווירה בלעדית ואלגנטית',
        'הזדמנות לפגוש מטיילים אחרים'
      ]
    }
  },
  2: {
    es: {
      title: 'Experiencia Tegui',
      description: 'Cena degustación en uno de los restaurantes más exclusivos de Buenos Aires. Cocina de autor con ingredientes locales de primera calidad.',
      includes: [
        'Menú degustación de 10 pasos',
        'Maridaje de vinos',
        'Mesa privada',
        'Chef\'s table experience'
      ],
      highlights: [
        'Restaurante top 50 del mundo',
        'Cocina de autor',
        'Experiencia única e inolvidable'
      ]
    },
    en: {
      title: 'Tegui Experience',
      description: 'Tasting dinner at one of the most exclusive restaurants in Buenos Aires. Author cuisine with top quality local ingredients.',
      includes: [
        '10-course tasting menu',
        'Wine pairing',
        'Private table',
        'Chef\'s table experience'
      ],
      highlights: [
        'Top 50 restaurant in the world',
        'Author cuisine',
        'Unique and unforgettable experience'
      ]
    },
    he: {
      title: 'חווית Tegui',
      description: 'ארוחת טעימות באחת המסעדות הבלעדיות ביותר בבואנוס איירס. מטבח מחבר עם מרכיבים מקומיים באיכות גבוהה.',
      includes: [
        'תפריט טעימות של 10 מנות',
        'זיווג יינות',
        'שולחן פרטי',
        'חוויית שולחן השף'
      ],
      highlights: [
        'מסעדה בין 50 הטובות בעולם',
        'מטבח מחבר',
        'חוויה ייחודית ובלתי נשכחת'
      ]
    }
  },
  3: {
    es: {
      title: 'Experiencia Aramburu',
      description: 'Cena íntima en uno de los restaurantes más exclusivos de Buenos Aires. Cocina molecular y de autor con ingredientes premium.',
      includes: [
        'Menú degustación de 12 pasos',
        'Maridaje premium',
        'Mesa exclusiva',
        'Show cooking'
      ],
      highlights: [
        'Cocina molecular de vanguardia',
        'Ambiente íntimo y exclusivo',
        'Experiencia gastronómica única'
      ]
    },
    en: {
      title: 'Aramburu Experience',
      description: 'Intimate dinner at one of the most exclusive restaurants in Buenos Aires. Molecular and author cuisine with premium ingredients.',
      includes: [
        '12-course tasting menu',
        'Premium wine pairing',
        'Exclusive table',
        'Show cooking'
      ],
      highlights: [
        'Cutting-edge molecular cuisine',
        'Intimate and exclusive atmosphere',
        'Unique gastronomic experience'
      ]
    },
    he: {
      title: 'חווית Aramburu',
      description: 'ארוחת ערב אינטימית באחת המסעדות הבלעדיות ביותר בבואנוס איירס. מטבח מולקולרי ומחבר עם מרכיבים פרימיום.',
      includes: [
        'תפריט טעימות של 12 מנות',
        'זיווג יינות פרימיום',
        'שולחן בלעדי',
        'מופע בישול'
      ],
      highlights: [
        'מטבח מולקולרי חדשני',
        'אווירה אינטימית ובלעדית',
        'חוויה גסטרונומית ייחודית'
      ]
    }
  }
}

