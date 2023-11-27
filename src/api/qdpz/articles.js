import request from '@/utils/request'

// 查询article sheet列表
export function listArticles(query) {
  return request({
    url: '/qdpz/articles/list',
    method: 'get',
    params: query
  })
}

// 查询article sheet详细
export function getArticles(id) {
  return request({
    url: '/qdpz/articles/' + id,
    method: 'get'
  })
}

// 新增article sheet
export function addArticles(data) {
  return request({
    url: '/qdpz/articles',
    method: 'post',
    data: data
  })
}

// 修改article sheet
export function updateArticles(data) {
  return request({
    url: '/qdpz/articles',
    method: 'put',
    data: data
  })
}

// 删除article sheet
export function delArticles(id) {
  return request({
    url: '/qdpz/articles/' + id,
    method: 'delete'
  })
}
