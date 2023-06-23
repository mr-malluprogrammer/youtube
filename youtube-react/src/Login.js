import React, { useState } from 'react'
import './Login.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';


function Login() {
    // creating new use state
    const [message, setMessage] = useState('')
    const [ss, setSS] = useState(false)
    const [userCredentials, setUserCredentials] = useState({ name: '', password: '' })


    const ButtonClick = (e) => {
        e.preventDefault()
        setSS(true)
        console.log(userCredentials)
        //From backend
        try {
            fetch("http://localhost:5000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessage(data.message)
                    setSS(false)
                })
                .catch((err) => {
                    setMessage("Sorry error connecting the server")
                    setSS(false)
                })


        }
        catch {
            setMessage('Sorry error connecting the server')
        }
    }
    return (
        <Card>

            {/* <div className='server-alert'>
                    
                </div> */}


            <form onSubmit={ButtonClick}>
                <div className='login'>
                    <h1>Login</h1>
                    <div>
                        <input className='login-input' onChange={(e) => setUserCredentials({ name: e.target.value, password: userCredentials.password })} id='login-username' type='text' placeholder="Username" required />
                        <input className='login-input' onChange={(e) => setUserCredentials({ name: userCredentials.name, password: e.target.value })} type='password' placeholder="Password" required />
                        <br />
                        <Button
                            variant="primary"
                            className='login-input'
                            type='submit'
                        >Submit</Button>
                    </div>
                    <div>
                        {ss && (<div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>)}
                    {message.length > 0 ? (
                        <div style={{marginTop:'10px'}}>
                    <Alert variant={`${message === "Sorry error connecting the server" ? "danger" : message === "Sorry user need to register" ? "warning":"success"}`} dismissible>
                        <Alert.Heading>{message === "Sorry error connecting the server" ? (
                            <div>
                                <svg style={{ marginBottom: '5px', marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                </svg>{message}
                            </div>) : message}</Alert.Heading>
                    </Alert>
                    </div>
                    ): (console.log())}
                       
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default Login