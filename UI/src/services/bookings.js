import axios from 'axios'
import { config } from './config'

export async function getMyBookings() {
  try {
    const url = `${config.server}/booking`
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

export async function createBooking(propertyId, fromDate, toDate, total) {
  try {
    const url = `${config.server}/booking`
    const body = { propertyId, fromDate, toDate, total }
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

export async function cancelBooking(bookingId) {
  try {
    const url = `${config.server}/booking/${bookingId}`
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

