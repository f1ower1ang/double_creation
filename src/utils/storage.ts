export function set(key: string, storeValue: any, expired: number | null) {
  let time = -1
  if (expired) {
    time = new Date().getTime() + 60 * 60 * 24 * 1000 * expired
  }
  const value = {
    time,
    storeValue
  }
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(e)
  }
}

export function get(key: string) {
  if (localStorage.getItem(key)) {
    const value = localStorage.getItem(key)
    const { time, storeValue } = JSON.parse(value as string)
    const now = new Date().getTime()
    if (time - now <= 0 && time !== -1) {
      localStorage.removeItem(key)
      return null
    } else {
      try {
        return JSON.parse(storeValue)
      } catch (e) {
        return storeValue
      }
    }
  } else {
    return null
  }
}

export function update(key: string, storeValue: any) {
  if (localStorage.getItem(key)) {
    const value = localStorage.getItem(key)
    const { time } = JSON.parse(value as string)
    const now = new Date().getTime()

    if (time - now <= 0 && time !== -1) {
      localStorage.removeItem(key)
      return false
    } else {
      localStorage.setItem(key, JSON.stringify({time, storeValue}))
    }
  } else {
    set(key, storeValue, 1)
  }
}

export function remove(key: string) {
  localStorage.removeItem(key)
}
