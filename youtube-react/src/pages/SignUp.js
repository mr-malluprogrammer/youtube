import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import Alert from 'react-bootstrap/Alert';
import * as yup from 'yup';
import { Link } from 'react-router-dom'
import ReactCodeInput from 'react-verification-code-input';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import TC from './TC';
import '../css/SignUp.css'

function SignUp() {

  const [show, setShow] = useState(false);
  const { Formik } = formik;
  const [check, setCheck] = useState(false)
  const [cError, setCError] = useState('')
  const [dataGot, setDataGot] = useState({})
  const [trigger, setTrigger] = useState(false)
  const [sendTrigger, setSendTrigger] = useState(false)
  const [codeGot, setCodeGot] = useState('')
  const [fillMsg, setFillMsg] = useState(false)
  const [toastShow, setToastShow] = useState(false);
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
  }, [seconds,minutes]);




  const navigate = useNavigate()

  const handleShow = () => setShow(true);


  const UserForm = yup.object().shape(
    {

      firstName: yup.string().min(3, "Minimum 3 charecters").max(16, "Maxmimum 16 charecters").required("First Name is a required feild"),

      lastName: yup.string().max(16, "Maxmimum 16 charecters"),

      email: yup.string().required("At least one email is required").email("Invalid Email!").matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid Email!")
        .test("Email is valid", "Email already in use!", function (value) {
          setCheck(true)
          return new Promise((resolve, reject) => {
            fetch("http://192.168.1.16:5000/emailValidation", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ "email": value })
            })
              .then(async (res) => await res.json())
              .then((data) => {
                setCheck(false)
                setCError('')
                resolve(data.status)

              })
              .catch((error) => {
                setCheck(false)
                resolve(false)
                setCError('Server error!')

              })
          })
        }),

      password: yup.string().max(16, "Maxmimum 16 charecters").required("Password is a required feild").matches(
        // eslint-disable-next-line
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),

      confirmPassword: yup.string().min(6, "Minimum 6 charecters").max(16, "Maxmimum 16 charecters").required("Confirm Password is a required feild").oneOf([yup.ref('password')], "Password must match!"),

      terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),

      username: yup.string().min(4, "Minimum 4 charecters").max(20, "Maxmimum 20 charecters").required("Username is a required feild")
        .test("Username is valid", "Username already in use!", function (value) {
          setCheck(true)
          return new Promise((resolve, reject) => {
            fetch("http://192.168.1.16:5000/usernameValidation", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ "username": value })
            })
              .then(async (res) => await res.json())
              .then((data) => {
                setCheck(false)
                setCError('')
                resolve(data)

              })
              .catch((error) => {
                setCheck(false)
                resolve(false)
                setCError('Server error!')

              })
          })
        })
        .matches(/^(\S+$)/g, 'This field cannot contain only blankspaces')
        .matches(/^[\w-_.]*$/, "Only alphabets and numbers are allowed for this field ")

    }
  );


  const sendMail = (e) => {
    setSendTrigger(true)
    setSeconds(30); 
    setMinutes(1); 
    try {
      fetch("http://192.168.1.16:5000/sendEmail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: e.email,
          name: e.firstName
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setSeconds(30); 
          setMinutes(1); 
          setSendTrigger(false);
          setToastShow(true);
          setTrigger(true);
        })
        .catch((err) => {
          setSendTrigger(false)
          setCError("Sorry error connecting the server")
          setTrigger(false);
        })


    }
    catch {
      setSeconds(0); 
          setMinutes(0); 
          setTrigger(false)
      console.log('Sorry error connecting the server')
    }
  }

  const checkCode = () => {
    console.log(codeGot)
    console.log(dataGot)

    try {
      fetch("http://192.168.1.16:5000/signup", {
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
          if (data.message === 'success') {
            console.log("Added to backend")
            navigate("/login")
          }
          else {
            setCError("Sorry Email Code Expired!")
            setTrigger(false)
          }
        })
        .catch((err) => {
          setCError("Sorry error connecting the server")
          setTrigger(false)
          console.log("Sorry error connecting the server")
        })


    }
    catch {
      console.log('Sorry error connecting the server')
    }
  }


  return (
    <div className='signUp'>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast bg='success' onClose={() => setToastShow(false)} show={toastShow} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Mr, MalluProgrammer</strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body>Woohoo, email sent successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
      <Card style={{ padding: '30px', width: '850px', minHeight: '450px' }}>
        {trigger === false ? (
          <div className='fadeIn'>
            <h1 style={{ fontSize: '50px' }}>Let's get started</h1>

            <Formik
              validationSchema={UserForm}
              onSubmit={(e) => { setDataGot(e); sendMail(e); }}
              validateOnChange={false}
              initialValues={{
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                terms: false,
              }}
            >

              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>


                  <Row className="mb-3">

                    <Form.Group as={Col} md="4" controlId="validationFormik01">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        placeholder="First Name"
                        onChange={handleChange}
                        isValid={touched.firstName && !errors.firstName && !check}
                        isInvalid={!!errors.firstName}
                      />
                      {check && <Form.Control.Feedback>Looks good!</Form.Control.Feedback>}
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>



                    <Form.Group as={Col} md="4" controlId="validationFormik02">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={values.lastName}
                        onChange={handleChange}
                        isValid={touched.lastName && !errors.lastName && !check}
                        isInvalid={!!errors.lastName}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                      {check && <Form.Control.Feedback>Looks good!</Form.Control.Feedback>}
                    </Form.Group>



                    <Form.Group as={Col} md="4" controlId="validationFormikUsername">
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
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                          isValid={touched.username && !errors.username && !check}
                        />
                        <Form.Control.Feedback type="invalid">
                          {cError.length > 0 ? cError : errors.username}
                        </Form.Control.Feedback>
                        {check && <Form.Control.Feedback>Valid Username</Form.Control.Feedback>}
                      </InputGroup>
                    </Form.Group>


                  </Row>


                  <Row className="mb-3">


                    <Form.Group as={Col} md="4" controlId="validationFormikEmail">
                      <Form.Label>Email</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                          </svg>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          aria-describedby="inputGroupPrepend"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          isValid={touched.email && !errors.email && !check}
                        />
                        <Form.Control.Feedback type="invalid">
                          {cError.length > 0 ? cError : errors.email}
                        </Form.Control.Feedback>
                        {check && <Form.Control.Feedback>Valid Email</Form.Control.Feedback>}
                      </InputGroup>
                    </Form.Group>


                    <Form.Group as={Col} md="4" controlId="validationFormik04">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isValid={touched.password && !errors.password && !check}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group as={Col} md="4" controlId="validationFormik05">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        isValid={touched.confirmPassword && !errors.confirmPassword && !check}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>


                  </Row>
                  <Form.Group style={{marginTop:'80px'}}>
                    <Form.Check
                      required
                      name="terms"
                      label={(<span onClick={handleShow}>Agree to terms and conditions</span>)}
                      onChange={handleChange}
                      isInvalid={!!errors.terms}
                      isValid={touched.terms && !errors.terms && !check}
                      feedback={errors.terms}
                      feedbackType="invalid"
                      id="validationFormik0"
                    />
                  </Form.Group>
                  <div style={{ display: 'flex', marginTop:'20px' }}>
                    <Button type="submit" variant='dark' disabled={check || sendTrigger}>Submit form</Button>
                    <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end' }}>
                      <Link to='/login' style={{ color: 'blue' }}>Already have an account</Link>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
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
                <Button variant='dark' disabled={seconds > 0 || minutes > 0} onClick={() => { sendMail({email: dataGot.email, firstName: dataGot.firstName}); }}>
                  Resend OTP
                </Button>
              </div>




              <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setTrigger(false)}>Change Email ID</span>
              </div>
            </div>
          </div>
        )}

        {cError.length > 0 ? (
          <div style={{ marginTop: '10px' }}>
            <Alert variant="danger">
              <Alert.Heading>
                <div>
                  <svg style={{ marginBottom: '5px', marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                  </svg>{cError}
                </div>
              </Alert.Heading>
            </Alert>
          </div>
        ) : (console.log())}
      </Card>
      <TC show={show} setShow={setShow} />
    </div>
  )
}

export default SignUp