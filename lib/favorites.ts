// Sistema de favoritos/likes

export interface Favorite {
  experienciaId: number
  addedAt: number
}

export function getFavorites(): Favorite[] {
  if (typeof window === 'undefined') return []
  const favoritesStr = localStorage.getItem('gentum_favorites')
  return favoritesStr ? JSON.parse(favoritesStr) : []
}

export function saveFavorites(favorites: Favorite[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_favorites', JSON.stringify(favorites))
}

export function isFavorite(experienciaId: number): boolean {
  const favorites = getFavorites()
  return favorites.some(f => f.experienciaId === experienciaId)
}

export function toggleFavorite(experienciaId: number): boolean {
  const favorites = getFavorites()
  const index = favorites.findIndex(f => f.experienciaId === experienciaId)
  
  if (index === -1) {
    // Agregar a favoritos
    favorites.push({ experienciaId, addedAt: Date.now() })
    saveFavorites(favorites)
    return true
  } else {
    // Quitar de favoritos
    favorites.splice(index, 1)
    saveFavorites(favorites)
    return false
  }
}

export function getFavoriteCount(): number {
  return getFavorites().length
}




