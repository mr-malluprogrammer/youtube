import React, { useEffect, useState } from 'react'
import '../css/FP.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Swal from 'sweetalert2'
import * as formik from 'formik';
import * as yup from 'yup';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import ReactCodeInput from 'react-verification-code-input';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate()
    const { Formik } = formik;
    const [serverMessage, setServerMessage] = useState('')
    const [trigger, setTrigger] = useState(false)
    const [check, setCheck] = useState(false)
    const [cError, setCError] = useState('')
    const [dataGot, setDataGot] = useState({})
    const [fillMsg, setFillMsg] = useState(false)
    const [codeGot, setCodeGot] = useState([])
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds, minutes]);




    const UserForm = yup.object().shape(
        {
            email: yup.string()
                .required("Email is required").email("Invalid Email Format!").matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid Email Format!")
                .test("Email is valid", "Email not found in our database!", function (value) {
                    setCheck(true)
                    setServerMessage('')
                    return new Promise(async (resolve, reject) => {
                        await fetch("http://192.168.1.16:5000/emailValidation", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "email": value })
                        })
                            .then(async (res) => await res.json())
                            .then((data) => {
                                if (data.status) {
                                    setCheck(false)
                                    setCError('')
                                    resolve(false)
                                }
                                else {
                                    resolve(true)
                                    setCError('')
                                }

                            })
                            .catch((error) => {
                                setTrigger(false)
                                setCheck(false)
                                resolve(false)
                                setCError('Server down to check the Email!')
                                setServerMessage('Server down to send verification code, Please try after sometime.')


                            })
                    })
                })


        }
    );

    const sendForgotRequest = (e) => {
        console.log(e)
        setDataGot(e)
        setSeconds(30);
        setMinutes(1);
        try {
            fetch("http://192.168.1.16:5000/sendEmail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: e.email
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setCheck(false)
                    setSeconds(30);
                    setMinutes(1);
                    setTrigger(true)
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-success'
                        },
                        buttonsStyling: false
                    })
                    swalWithBootstrapButtons.fire({
                        title: 'Success!',
                        text: 'Email has sent successfully!',
                        icon: 'success',
                        allowOutsideClick: false,
                        confirmButtonText: 'Close',
                    })
                })
                .catch((err) => {
                    setCError("Sorry error connecting the server")
                    setTrigger(false);
                })


        }
        catch {
            setSeconds(0);
            setMinutes(0);
            setTrigger(false)
            console.log('Sorry error connecting the server')
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-dark'
                },
                buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
                title: "Server not found!",
                html: "The backend server for sending an email is down for some reason. Please check back after sometime.",
                icon: 'question',
                allowOutsideClick: false,
                confirmButtonText: 'Close'
            })
        }
    }

    const checkCode = () => {
        console.log(codeGot)
        console.log(dataGot)

        try {
            fetch("http://192.168.1.16:5000/forgetPass", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userData: dataGot,
                    pin: codeGot
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.codeStatus) {
                        if (data.message === "User dont exist!") {
                            const swalWithBootstrapButtons = Swal.mixin({
                                customClass: {
                                    confirmButton: 'btn btn-warning'
                                },
                                buttonsStyling: false
                            })
                            swalWithBootstrapButtons.fire({
                                title: 'User not found!',
                                text: 'The user was not registered inn our database!',
                                icon: 'warning',
                                allowOutsideClick: false,
                                confirmButtonText: 'Close',
                            })
                        }
                        else {
                            const swalWithBootstrapButtons = Swal.mixin({
                                customClass: {
                                    confirmButton: 'btn btn-success'
                                },
                                buttonsStyling: false
                            })
                            swalWithBootstrapButtons.fire({
                                title: 'Success!',
                                text: 'Code verified successfully!',
                                icon: 'success',
                                allowOutsideClick: false,
                                confirmButtonText: 'Close',
                            })
                            setSeconds(0)
                            setMinutes(0)
                            navigate('/login')
                        }
                    }
                    else {
                        const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                                confirmButton: 'btn btn-warning'
                            },
                            buttonsStyling: false
                        })
                        swalWithBootstrapButtons.fire({
                            title: 'Invalid Code!',
                            text: 'The code which received to user is Invalid!, Please check your inbox and try again.',
                            icon: 'warning',
                            allowOutsideClick: false,
                            confirmButtonText: 'Close',
                        })
                        setCodeGot(0)
                        setServerMessage("Sorry Email Code Expired!")
                    }
                })
                .catch((err) => {
                    setServerMessage("Sorry error connecting the server")
                    setTrigger(false)
                    console.log("Sorry error connecting the server")
                })


        }
        catch {
            console.log('Sorry error connecting the server')
        }
    }

    return (
        <div className='forgotpassword'>
            <Card style={{ padding: '30px', width: '700px', minHeight: '220px' }}>
                {!trigger ? (
                    <Formik
                        validationSchema={UserForm}
                        validateOnChange={false}
                        onSubmit={(e) => sendForgotRequest(e)}
                        initialValues={{
                            email: ''
                        }}
                    >

                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate className='fadeIn' onSubmit={handleSubmit}>
                                <h1 style={{ fontSize: '50px' }}>Forgot Password!</h1>
                                <Row className="mb-4">

                                    <Form.Group as={Col} md="12" controlId="validationFormikEmail">
                                        <Form.Label>Please enter your email to reset the password</Form.Label>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text id="inputGroupPrepend">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                                                </svg>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="xyz@abc.com"
                                                aria-describedby="inputGroupPrepend"
                                                name="email"
                                                style={{ fontSize: '30px' }}
                                                value={values.email}
                                                onChange={handleChange}
                                                disabled={check}
                                                isInvalid={!!errors.email}
                                                isValid={touched.email && !errors.email && !check}
                                            />
                                            <Button type='submit' variant='dark' style={{ fontSize: '30px' }} disabled={check}>Submit</Button>
                                            <Form.Control.Feedback type="invalid">
                                                {cError.length > 0 ? cError : errors.email}
                                            </Form.Control.Feedback>
                                            {check && <Form.Control.Feedback>Valid Email</Form.Control.Feedback>}
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Link to='/login'>Try Logging In</Link>

                            </Form>
                        )}
                    </Formik>)
                    : (
                        <div className='fadeIn'>
                            <h3>Please enter the code that you have received via email</h3>
                            <p>Email ID - {dataGot.email}</p>
                            <Form>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginTop: '40px' }}>
                                    <ReactCodeInput fields={4} onComplete={(e) => { setCodeGot(e); setFillMsg(false) }} required={true} />
                                    {fillMsg && <p style={{ color: 'red' }}>Please fill all the feild before continuing</p>}
                                    <div style={{ marginTop: '30px' }}>
                                        <Button variant='dark' onClick={() => { codeGot.length > 0 ? checkCode() : setFillMsg(true) }}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                        </svg></Button>
                                    </div>
                                </div>
                            </Form>


                            <br />
                            <div style={{ display: 'flex' }}>



                                <div className="countdown-text">
                                    {seconds > 0 || minutes > 0 ? (
                                        <p>
                                            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                                            {seconds < 10 ? `0${seconds}` : seconds}
                                        </p>
                                    ) : (
                                        <p>Didn't recieve code?</p>
                                    )}
                                    <Button variant='dark' disabled={seconds > 0 || minutes > 0} onClick={() => { sendForgotRequest({ email: dataGot.email }); }}>
                                        Resend OTP
                                    </Button>
                                </div>
                            </div>
                        </div>

                    )}





                {check && (<div className="text-center">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>)}
                {serverMessage === "Server down to send verification code, Please try after sometime." && !trigger ? (
                    <div style={{ marginTop: '10px' }}>
                        <Alert variant="danger" >
                            <Alert.Heading>
                                <div>
                                    <svg style={{ marginBottom: '5px', marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                    </svg>{serverMessage}
                                </div>
                            </Alert.Heading>
                        </Alert>
                    </div>
                ) : console.log()}
            </Card>

        </div>
    )
}

export default ForgotPassword