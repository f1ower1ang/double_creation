import Mock from 'mockjs'
import path from '../utils/path'

function parseUrl(url: string): object {
  const params: any = {}
  const pattern: RegExp = /(\w+)=(\w+)/gi
  url.replace(pattern, function(a, b, c) {
    params[b] = c
    return a
  })
  return params
}

const getPath = (path: string) => RegExp('/api' + path + '.*')

Mock.mock(getPath(path.course.recommend), 'get', (options: any) => {
  const recList = ['1.1 车标图像分类', '1.2 交通标志识别', '2.1 分类时尚品', '2.2 分类影评文字', '2.3 预测房价模型', '3.1 Eager Mode']
  const jsonData = require('./json/courses.json')
  const data = jsonData.filter((item: any) => {
    return recList.indexOf(item.name) > -1
  })
  return {
    code: 0,
    data
  }
})

Mock.mock(getPath(path.course.detail), 'get', (options: any) => {
  const params: any = parseUrl(options.url)
  const jsonData = require('./json/courses.json')
  const index = jsonData.findIndex((item: any) => item._id === params.id)
  let data = {}
  if (index > -1) {
    data = jsonData[index]
  }
  return {
    data,
    code: 0
  }
})

Mock.mock(getPath(path.course.default), 'get', function(options: any) {
  const params: any = parseUrl(options.url)
  const jsonData = require('./json/courses.json')
  let data = jsonData.slice((params.page - 1) * params.limit, params.page * params.limit)

  return {
    code: 0,
    data,
    total: jsonData.length
  }
})
