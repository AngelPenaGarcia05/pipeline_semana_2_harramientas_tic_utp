import { beforeEach, describe, expect, it } from 'vitest'
import { loadFromStorage, removeFromStorage, saveToStorage, storageKey } from '../storage'

beforeEach(() => {
  window.localStorage.clear()
})

describe('almacenamiento local', () => {
  it('guarda y recupera valores', () => {
    const value = { name: 'Muñeca Bella', stock: 5 }
    saveToStorage('test', value)
    expect(loadFromStorage('test', null)).toEqual(value)
  })

  it('devuelve el valor por defecto si la clave no existe', () => {
    expect(loadFromStorage('missing', 'default')).toBe('default')
  })

  it('devuelve el valor por defecto si el JSON es inválido', () => {
    window.localStorage.setItem(storageKey('bad'), '{esto no es json')
    expect(loadFromStorage('bad', 0)).toBe(0)
  })

  it('elimina valores', () => {
    saveToStorage('test', 1)
    removeFromStorage('test')
    expect(loadFromStorage('test', null)).toBeNull()
  })
})