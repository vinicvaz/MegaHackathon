import React, { useEffect } from 'react'
import api from '../../services/api'

export default function Profile() {
  let data = []
  // eslint-disable-next-line
  const profile = useEffect(() => {
    api.get('/profile', async (req, res) => {
      // eslint-disable-next-line
      data = await res.data
    })
  })

  return <div><h1>Profiles</h1>{data}</div>
}
