import axios from 'axios'
import { config } from './config'

export async function getCategories() {
  try {
    const url = `${config.server}/category`
    const response = await axios.get(url, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}

export async function addCategory(title, details, file) {
  try {
    const url = `${config.server}/category`
    const body = new FormData()
    body.append('title', title)
    body.append('details', details)
    body.append('icon', file)

    const response = await axios.post(url, body, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}

export async function deleteCategory(id) {
  try {
    const url = `${config.server}/category/${id}`
    const response = await axios.delete(url, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}
