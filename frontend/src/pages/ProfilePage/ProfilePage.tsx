import {useAppDispatch, useAppSelector} from "store/store.ts";
import CustomInput from "components/CustomInput";
import {Button, Form} from "reactstrap";
import {FormEvent, useEffect, useState} from "react";
import {handleUpdateProfile, setValidationError} from "store/slices/userSlice.ts";

export const ProfilePage = () => {

    const {username, email, validation_error, validation_success} = useAppSelector((state) => state.user)

    const [inputUsername, setInputUsername] = useState(username)

    const [inputEmail, setInputEmail] = useState(email)

    const [inputPassword, setInputPassword] = useState("")

    const dispatch = useAppDispatch()

    useEffect(() => {
        const isValid = inputUsername.length != 0 && inputEmail.length != 0
        dispatch(setValidationError(!isValid))
    }, [inputUsername, inputEmail, inputPassword]);

    const handleSaveProfile = async (e:FormEvent) => {
        e.preventDefault()

        if (validation_error){
            return
        }

        const data = {
            username: inputUsername,
            email: inputEmail,
            password: inputPassword
        }

        dispatch(handleUpdateProfile(data))
    }

    return (
        <Form onSubmit={handleSaveProfile} className="w-25">
            <CustomInput label="Логин" value={inputUsername} setValue={setInputUsername} error={validation_error} errorText={"Введены некорректные данные"} valid={validation_success} required={false} />
            <CustomInput label="Почта" value={inputEmail} setValue={setInputEmail} error={validation_error} errorText={"Введены некорректные данные"} valid={validation_success} required={false} />
            <CustomInput label="Пароль" placeholder="Введите новый пароль" value={inputPassword} setValue={setInputPassword} error={validation_error} valid={validation_success} errorText={"Введены некорректные данные"} required={false} />
            <Button type="submit" color="primary" className="mt-3">Сохранить</Button>
        </Form>
    )
}