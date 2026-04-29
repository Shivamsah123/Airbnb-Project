import axios from 'axios'
import { config } from './config'

export async function getAdminStats() {
  try {
    const url = `${config.server}/admin/stats`
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

export async function getAdminUsers() {
  try {
    const url = `${config.server}/admin/users`
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

export async function deleteUser(id) {
  try {
    const url = `${config.server}/admin/users/${id}`
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

export async function getAdminProperties() {
  try {
    const url = `${config.server}/admin/properties`
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

export async function deleteAdminProperty(id) {
  try {
    const url = `${config.server}/admin/properties/${id}`
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

export async function getAdminBookings() {
  try {
    const url = `${config.server}/admin/bookings`
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
