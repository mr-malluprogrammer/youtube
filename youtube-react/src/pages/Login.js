import React, { useState } from 'react'
import '../css/Login.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit';


function Login() {
    // creating new use state
    const [message, setMessage] = useState('')
    const [data, setData] = useState({})
    const [ss, setSS] = useState(false)
    const [userCredentials, setUserCredentials] = useState({ username: '', password: '' })
    const [validated, setValidated] = useState(false);
    const signIn = useSignIn()


    const ButtonClick = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            console.log('i am here')
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            e.preventDefault();
            e.stopPropagation();
            setSS(true)
            console.log(userCredentials)
            //From backend
            try {
                fetch("http://192.168.1.16:5000/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userCredentials)
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setMessage(data.message)
                        setData(data)
                        signIn({
                            token: data.token,
                            expiresIn: 60,
                            tokenType: "Bearer",
                            authState: { username: data.username }
                        })
                        setSS(false)
                    })
                    .catch((err) => {
                        setMessage("Sorry error connecting the server")
                        setData({ status: false })
                        setSS(false)
                    })


            }
            catch {
                setMessage('Sorry error connecting the server')
            }
        }

    }
    return (
        <div className='login'>
            <Card style={{ padding: '30px', width: '800px', minHeight: '320px' }}>

                {/* <div className='server-alert'>  
                    
                </div> */}
                <Form noValidate className='fadeIn' validated={validated} onSubmit={ButtonClick}>
                    <h1 style={{ fontSize: '50px' }}>Welcome Back{data.status && (' ' + data.name)}!</h1>
                    <Row className="mb-4">

                        <Form.Group as={Col} md="6" controlId="validationFormikUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    </svg>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    aria-describedby="inputGroupPrepend"
                                    onChange={(e) => setUserCredentials({ username: e.target.value, password: userCredentials.password })}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a username.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>



                        <Form.Group as={Col} controlId="validationCustom04">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setUserCredentials({ username: userCredentials.username, password: e.target.value })}
                                required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {data.status === true ? (
                        <Link to='/' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="black" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg></Link>
                    ) : (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button type="submit" variant='dark' disabled={ss}>Log In</Button>
                        <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Link to='/signup'>Create an account</Link>
                                <Link to='/forgotpassword'>Forogt password</Link>
                            </div>
                        </div>
                    </div>)}


                    <div>
                        {ss && (<div className="text-center">
                            <div className="spinner-border text-dark" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>)}
                        {data.status === false ? (
                            <div style={{ marginTop: '10px' }}>
                                <Alert variant={`${message === "Sorry error connecting the server" ? "danger" : "warning"}`} >
                                    <Alert.Heading>
                                        <div>
                                            <svg style={{ marginBottom: '5px', marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                            </svg>{message}
                                        </div></Alert.Heading>
                                </Alert>
                            </div>
                        ) : (console.log())}

                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default Login