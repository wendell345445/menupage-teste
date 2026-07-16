export type MenuThemeKey = 'blue' | 'red' | 'black'

export interface MenuTheme {
  key: MenuThemeKey
  name: string
  primaryColor: string
  secondaryColor: string
}

export const menuThemes = {
  blue: {
    key: 'blue',
    name: 'Azul',
    primaryColor: '#2563EB',
    secondaryColor: '#1D4ED8',
  },
  red: {
    key: 'red',
    name: 'Vermelho',
    primaryColor: '#E11D48',
    secondaryColor: '#BE123C',
  },
  black: {
    key: 'black',
    name: 'Preto',
    primaryColor: '#000000',
    secondaryColor: '#000000',
  },
} satisfies Record<MenuThemeKey, MenuTheme>

export const DEFAULT_MENU_THEME = menuThemes.black

export function getMenuThemeFromUrl(): MenuTheme {
  if (typeof window === 'undefined') return DEFAULT_MENU_THEME

  const params = new URLSearchParams(window.location.search)
  const theme = params.get('theme') as MenuThemeKey | null

  if (theme && theme in menuThemes) {
    return menuThemes[theme]
  }

  return DEFAULT_MENU_THEME
}
