export interface Course {
  title: string
  time: string
  date: string
  logo: string
  id: string
}

const baseImg = 'https://blackwalnut.tech'

export function formatCourse(item: any): Course {
  return {
    title: item.name,
    time: item.time,
    date: item.pubdate,
    logo: baseImg + item.codelabsType.img,
    id: item._id
  }
}
