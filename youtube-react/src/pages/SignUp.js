import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom'
import '../css/SignUp.css'
import Alert from 'react-bootstrap/Alert';


function SignUp() {
  const { Formik } = formik;
  const [check, setCheck] = useState(false)
  const [cError, setCError] = useState('')


  const UserForm = yup.object().shape(
    {

      firstName: yup.string().min(3, "Minimum 3 charecters").max(16, "Maxmimum 16 charecters").required("First Name is a required feild"),

      lastName: yup.string().max(16, "Maxmimum 16 charecters").required("Last Name is a required feild"),

      email: yup.string().required("At least one email is required").email("Invalid Email!").matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid Email!")
        .test("Email is valid", "Email already in use!", function (value) {
          setCheck(true)
          setCError('')
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
                resolve(data.status)
                setCheck(false)
              })
              .catch((error) => {
                resolve(false)
                setCheck(false)
                setCError('Sorry error connecting the server!')
              })
          })
        })
      ,
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


  return (
    <div className='signUp'>
      <Card style={{ padding: '30px', width: '850px', minHeight: '450px' }}>

        <div className='fadeIn'>
          <h1 style={{ fontSize: '50px' }}>Let's get started</h1>

          <Formik
            validationSchema={UserForm}
            onSubmit={(e) => { console.log(e) }}
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
                    {!check && <Form.Control.Feedback>Looks good!</Form.Control.Feedback>}
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
                    {!check && <Form.Control.Feedback>Looks good!</Form.Control.Feedback>}
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
                <Form.Group style={{ marginTop: '80px' }}>
                  <Form.Check
                    required
                    name="terms"
                    label="Agree to terms and conditions"
                    onChange={handleChange}
                    isInvalid={!!errors.terms}
                    isValid={touched.terms && !errors.terms && !check}
                    feedback={errors.terms}
                    feedbackType="invalid"
                    id="validationFormik0"
                  />
                </Form.Group>
                <div style={{ display: 'flex', marginTop: '20px' }}>
                  <Button type="submit" variant='dark' disabled={check}>Submit form</Button>
                  <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end' }}>
                    <Link to='/login' style={{ color: 'blue' }}>Already have an account</Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

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
    </div>
  )
}

export default SignUp