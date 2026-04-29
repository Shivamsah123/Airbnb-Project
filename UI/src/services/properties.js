import axios from 'axios'
import { config } from './config'

export async function getProperties(search = '') {
  try {
    // create url
    let url = `${config.server}/property`
    if (search) {
      url += `?search=${encodeURIComponent(search)}`
    }

    // create headers with require token
    // send GET request and get the response
    const response = await axios.get(url, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })

    // return response body
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}

export async function getPropertyDetails(id) {
  try {
    // create url
    const url = `${config.server}/property/details/${id}`

    // create headers with require token
    // send GET request and get the response
    const response = await axios.get(url, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })

    // return response body
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}

export async function deleteProperty(id) {
  try {
    // create url
    const url = `${config.server}/property/${id}`

    // create headers with require token
    const response = await axios.delete(url, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })

    // return response body
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}

export async function addProperty(
  categoryId,
  title,
  details,
  address,
  contactNo,
  ownerName,
  isLakeView,
  isTV,
  isAC,
  isWifi,
  isMiniBar,
  isBreakfast,
  isParking,
  guests,
  bedrooms,
  beds,
  bathrooms,
  rent,
  image
) {
  try {
    // create url
    const url = `${config.server}/property/`

    // create body to carry image (binary file)
    // since the image is of binary type, we can NOT use json syntax to create body
    const body = new FormData()
    body.append('categoryId', categoryId)
    body.append('title', title)
    body.append('details', details)
    body.append('address', address)
    body.append('contactNo', contactNo)
    body.append('ownerName', ownerName)
    body.append('isLakeView', isLakeView)
    body.append('isTV', isTV)
    body.append('isAC', isAC)
    body.append('isWifi', isWifi)
    body.append('isMiniBar', isMiniBar)
    body.append('isBreakfast', isBreakfast)
    body.append('isParking', isParking)
    body.append('guests', guests)
    body.append('bedrooms', bedrooms)
    body.append('beds', beds)
    body.append('bathrooms', bathrooms)
    body.append('rent', rent)
    body.append('photo', image)

    // create headers with require token
    const response = await axios.post(url, body, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })

    // return response body
    return response.data
  } catch (ex) {
    console.log(`exception: `, ex)
  }
}
