import request from '@/utils/request'

// 查询tldraw列表
export function listTldraw(query) {
  return request({
    url: '/tldraw/list',
    method: 'get',
    params: query
  })
}

// 查询tldraw详细
export function getTldraw(id) {
  return request({
    url: '/tldraw/' + id,
    method: 'get'
  })
}

// 新增tldraw
export function addTldraw(data) {
  return request({
    url: '/tldraw',
    method: 'post',
    data: data
  })
}

// 修改tldraw
export function updateTldraw(data) {
  return request({
    url: '/tldraw',
    method: 'put',
    data: data
  })
}

// 删除tldraw
export function delTldraw(id) {
  return request({
    url: '/tldraw/' + id,
    method: 'delete'
  })
}
