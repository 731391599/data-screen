import storage from 'store'

export function setStorage(key, value) {
    return storage.set(key, value)
}

export function getStorage(key) {
    return storage.get(key)
}

export function clearStorage() {
    return storage.clearAll()
}

export function removeStroage(key) {
    return storage.remove(key)
}

export function getToken() {
    return getStorage('X-Token')
}

export function setToken(value) {
    return setStorage('X-Token', value)
}
