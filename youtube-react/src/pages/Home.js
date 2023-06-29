import React from 'react'
import { useSignOut } from 'react-auth-kit'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Home() {
  const signOut = useSignOut()
  const navigate = useNavigate()

  const logout=() => {
    signOut();
    navigate("/login")
  }
  return (
    <div>
      <Button
            variant="dark"
            className='login-input'
            type='submit'
            onClick={logout}
        >Logout</Button>
    </div>
  )
}

export default Home