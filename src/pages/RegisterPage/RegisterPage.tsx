import {useAppDispatch} from "store/store.ts";
import React from "react";
import {handleRegister} from "store/slices/userSlice.ts";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";

const RegisterPage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement> ) => {
        e.preventDefault()

        const nameField = e.currentTarget.elements[0] as HTMLInputElement
        const emailField = e.currentTarget.elements[1] as HTMLInputElement
        const passwordField = e.currentTarget.elements[2] as HTMLInputElement

        const data = {
            username: nameField.value,
            email: emailField.value,
            password: passwordField.value
        }

        const result = await dispatch(handleRegister(data))

        if (result.type == "register/fulfilled") {
            navigate('/')
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md="4">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <h3 className="text-center">
                                    Форма регистрации
                                </h3>
                                <FormGroup className="mt-4">
                                    <Label for="name-input">
                                        Введите имя
                                    </Label>
                                    <Input placeholder="Имя" type="text" id="name-input" required/>
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Label for="email-input">
                                        Введите почту
                                    </Label>
                                    <Input placeholder="Почта" type="email" id="email-input" required/>
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Label for="password-input">
                                        Введите пароль
                                    </Label>
                                    <Input placeholder="Пароль" type="password" id="password-input" required/>
                                </FormGroup>
                                <Row className="justify-content-center mt-4">
                                    <Link to="/login/" style={{textAlign: "center"}}>Уже есть аккаунт? Войти</Link>
                                </Row>
                                <Row className="justify-content-center mt-4">
                                    <Button color="primary" className="w-75">
                                        Зарегистрироваться
                                    </Button>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage