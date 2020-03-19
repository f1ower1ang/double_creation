export interface Course {
  title: string
  time: string
  date: string
  imgUrl: string
  id: string
  rate: number
  counts: number
  detail: string
  recordId: number
}

const baseImg = 'https://blackwalnut.tech'

export function formatCourse(item: any): Course {
  return {
    title: item.coursename,
    time: item.coursetime ? item.coursetime + '分钟' : '不详',
    date: item.createtime,
    imgUrl: item.courseavater,
    id: item.id,
    rate: item.rate,
    counts: item.joinnumber,
    detail: item.coursedetail,
    recordId: -1
  }
}

export interface User {
  account: string
  sex: number
  name: string
  email: string
  phone: string
  avatar: string
  id: string
  joinTime: string
}
