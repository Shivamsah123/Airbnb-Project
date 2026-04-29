import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { addProperty } from '../../services/properties'
import { useNavigate } from 'react-router-dom'

function AddProperty() {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [address, setAddress] = useState('')
  const [owner, setOwner] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [beds, setBeds] = useState('')
  const [rent, setRent] = useState('')

  const [lake, setLake] = useState(0)
  const [tv, setTv] = useState(0)
  const [wifi, setWiFi] = useState(0)
  const [ac, setAC] = useState(0)
  const [minibar, setMinibar] = useState(0)
  const [parking, setParking] = useState(0)
  const [breakfast, setBreakfast] = useState(0)

  const [imageFile, setImageFile] = useState(null)

  // get the navigate function reference
  const navigate = useNavigate()

  const onSave = async () => {
    if (title.length == 0) {
      toast.warn('Please enter property title')
    } else if (details.length == 0) {
      toast.warn('Please enter details of the property')
    } else {
      const response = await addProperty(
        1,
        title,
        details,
        address,
        phone,
        owner,
        lake,
        tv,
        ac,
        wifi,
        minibar,
        breakfast,
        parking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent,
        imageFile
      )
      if (response['status'] == 'success') {
        toast.success('Successfully added a property')

        // go to the property listing
        navigate('/home/properties')
      } else {
        toast.error(response['error'])
      }
    }
  }

  return (
    <div className='container'>
      <h2 className='page-header'>Add Property</h2>
      <div className='row mb-3'>
        <div className='col'>
          <label htmlFor=''>Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='col'>
          <label htmlFor=''>Address</label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col'>
          <label htmlFor=''>Owner Name</label>
          <input
            onChange={(e) => setOwner(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='col'>
          <label htmlFor=''>Contact Number</label>
          <input
            onChange={(e) => setPhone(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col'>
          <label htmlFor=''># guests</label>
          <input
            onChange={(e) => setGuests(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='col'>
          <label htmlFor=''>Details</label>
          <textarea
            onChange={(e) => setDetails(e.target.value)}
            type='text'
            className='form-control'
            rows={3}
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col'>
          <label htmlFor=''># beds</label>
          <input
            onChange={(e) => setBeds(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='col'>
          <label htmlFor=''># bedrooms</label>
          <input
            onChange={(e) => setBedrooms(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col'>
          <label htmlFor=''># bathrooms</label>
          <input
            onChange={(e) => setBathrooms(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='col'>
          <label htmlFor=''>Rent</label>
          <input
            onChange={(e) => setRent(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  onChange={(e) => setLake(e.target.checked ? 1 : 0)}
                  className='form-check-input mt-0'
                  type='checkbox'
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Near to Lake ?</label>
            </div>
          </div>
          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  onChange={(e) => setTv(e.target.checked ? 1 : 0)}
                  className='form-check-input mt-0'
                  type='checkbox'
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is TV available ?</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  className='form-check-input mt-0'
                  type='checkbox'
                  onChange={(e) => setAC(e.target.checked ? 1 : 0)}
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is AC available?</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  className='form-check-input mt-0'
                  type='checkbox'
                  onChange={(e) => setWiFi(e.target.checked ? 1 : 0)}
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is WiFi available?</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  className='form-check-input mt-0'
                  type='checkbox'
                  onChange={(e) => setMinibar(e.target.checked ? 1 : 0)}
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is minibar available?</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  className='form-check-input mt-0'
                  onChange={(e) => setParking(e.target.checked ? 1 : 0)}
                  type='checkbox'
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is parking available?</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-group mb-3'>
              <div className='input-group-text'>
                <input
                  className='form-check-input mt-0'
                  type='checkbox'
                  onChange={(e) => setBreakfast(e.target.checked ? 1 : 0)}
                  aria-label='Checkbox for following text input'
                />
              </div>
              <label className='form-control'>Is breakfast available?</label>
            </div>
          </div>
        </div>

        <div className='col'>
          <label htmlFor=''>Select an image</label>
          <input
            onChange={(e) => setImageFile(e.target.files[0])}
            type='file'
            className='form-control'
          />
        </div>
      </div>

      <div className='row mt-2'>
        <div className='col'>
          <button
            onClick={onSave}
            className='btn btn-success'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddProperty
