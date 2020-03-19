export function getExt(filename: string) {
  const arr = filename.split('.')
  return arr[arr.length - 1]
}

export function checkImage(image: File, imageTypes: string[] | string, limit: number | null): boolean {
  const argType = Object.prototype.toString.call(imageTypes)
  const ext = getExt(image.name)
  if (argType === '[object Array]') {
    if (imageTypes.indexOf(ext) > -1) {
      return limit ? limit << 20 >= image.size : true
    } else {
      return false
    }
  } else if (argType === '[object String]') {
    if (ext !== imageTypes) {
      return false
    } else {
      return limit ? limit << 20 >= image.size : true
    }
  }
  return false
}
