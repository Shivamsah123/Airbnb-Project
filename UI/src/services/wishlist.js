import axios from 'axios'
import { config } from './config'

export async function toggleWishlist(propertyId) {
  try {
    const url = `${config.server}/wishlist/toggle`
    const body = { propertyId }
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

export async function getWishlist() {
  try {
    const url = `${config.server}/wishlist`
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

export async function getWishlistIds() {
  try {
    const url = `${config.server}/wishlist/ids`
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
