import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Redirect = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const { pathname } = location
    if (pathname === '/redirect') {
      navigate(-1)
    }
  }, [location, navigate])

  return null
}

export default Redirect 