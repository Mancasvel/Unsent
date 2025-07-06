import CryptoJS from 'crypto-js'

const APP_SECRET = process.env.ENCRYPTION_SECRET || 'unsent-app-secret-key-2024'

/**
 * Genera una clave de cifrado única para cada usuario
 */
export function generateUserKey(userId: string): string {
  return CryptoJS.PBKDF2(userId, APP_SECRET, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  }).toString()
}

/**
 * Cifra un mensaje usando AES-256
 */
export function encryptMessage(message: string, userKey: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, userKey).toString()
    return encrypted
  } catch (error) {
    console.error('Error al cifrar mensaje:', error)
    throw new Error('Error de cifrado')
  }
}

/**
 * Descifra un mensaje
 */
export function decryptMessage(encryptedMessage: string, userKey: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, userKey)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Error al descifrar mensaje:', error)
    throw new Error('Error de descifrado')
  }
}

/**
 * Genera una clave temporal para almacenar localmente
 */
export function generateLocalStorageKey(userId: string): string {
  return `unsent_key_${CryptoJS.MD5(userId).toString()}`
}

/**
 * Almacena la clave del usuario en localStorage
 */
export function storeUserKey(userId: string, userKey: string): void {
  try {
    const keyName = generateLocalStorageKey(userId)
    localStorage.setItem(keyName, userKey)
  } catch (error) {
    console.error('Error al almacenar clave de usuario:', error)
  }
}

/**
 * Recupera la clave del usuario desde localStorage
 */
export function retrieveUserKey(userId: string): string | null {
  try {
    const keyName = generateLocalStorageKey(userId)
    return localStorage.getItem(keyName)
  } catch (error) {
    console.error('Error al recuperar clave de usuario:', error)
    return null
  }
}

/**
 * Elimina la clave del usuario (logout o cambio de dispositivo)
 */
export function removeUserKey(userId: string): void {
  try {
    const keyName = generateLocalStorageKey(userId)
    localStorage.removeItem(keyName)
  } catch (error) {
    console.error('Error al eliminar clave de usuario:', error)
  }
}

/**
 * Verifica si el usuario tiene una clave almacenada
 */
export function hasUserKey(userId: string): boolean {
  try {
    const keyName = generateLocalStorageKey(userId)
    return localStorage.getItem(keyName) !== null
  } catch (error) {
    return false
  }
} 