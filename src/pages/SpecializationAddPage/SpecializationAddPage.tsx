import {Button, Col, Container, Row} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import React, {useEffect, useState} from "react";
import mock from "src/assets/mock.png"
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";
import {createSpecialization} from "store/slices/specializationsSlice.ts";
import {T_SpecializationAddData} from "modules/types.ts";

const SpecializationAddPage = () => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>()

    const [description, setDescription] = useState<string>()

    const [budget_place, setBudgetPlace] = useState<number>()

    const [budget_passing_score, setBudgetPassingScore] = useState<number>()

    const [paid_place, setPaidPlace] = useState<number>()

    const [price, setPrice] = useState<number>()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState(mock)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const handleCreateSpecialization = async() => {
        if (!name || !description || !price) {
            return
        }

        const formData = new FormData()

        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price as string)
        formData.append('budget_place', budget_place as string)
        formData.append('budget_passing_score', budget_passing_score as string)
        formData.append('paid_place', paid_place as string)

        if (imgFile != undefined) {
            formData.append('image', imgFile, imgFile.name)
        }

        await dispatch(createSpecialization(formData as T_SpecializationAddData))

        navigate("/specializations-table/")
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL as string} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput label="Цена" placeholder="Введите цену" value={price} setValue={setPrice} type="number"/>
                    <CustomInput label="Кол-во бюджетных мест" placeholder="Введите кол-во бюджетных мест" value={budget_place} setValue={setBudgetPlace} type="number"/>
                    <CustomInput label="Проходной балл на бюджет" placeholder="Введите проходной балл на бюджет" value={budget_passing_score} setValue={setBudgetPassingScore} type="number"/>
                    <CustomInput label="Кол-во платных мест" placeholder="Введите кол-во платных мест" value={paid_place} setValue={setPaidPlace} type="number"/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={handleCreateSpecialization}>Создать</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default SpecializationAddPage