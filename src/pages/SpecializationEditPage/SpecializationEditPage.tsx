import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteSpecialization,
    fetchSpecialization,
    removeSelectedSpecialization,
    updateSpecialization,
    updateSpecializationImage
} from "store/slices/specializationsSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const SpecializationEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {specialization} = useAppSelector((state) => state.specializations)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(specialization?.name)

    const [description, setDescription] = useState<string>(specialization?.description)

    const [price, setPrice] = useState<number>(specialization?.price)

    const [budget_place, setBudgetPlace] = useState<number>(specialization?.budget_place)

    const [budget_passing_score, setBudgetPassingScore] = useState<number>(specialization?.budget_passing_score)

    const [paid_place, setPaidPlace] = useState<number>(specialization?.paid_place)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(specialization?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveSpecialization = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateSpecializationImage({
                specialization_id: specialization.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            price,
            budget_place,
            budget_passing_score,
            paid_place
        }

        await dispatch(updateSpecialization({
            specialization_id: specialization.id,
            data
        }))

        navigate("/specializations-table/")
    }

    useEffect(() => {
        dispatch(fetchSpecialization(id))
        return () => dispatch(removeSelectedSpecialization())
    }, []);

    useEffect(() => {
        setName(specialization?.name)
        setDescription(specialization?.description)
        setPrice(specialization?.price)
        setBudgetPlace(specialization?.budget_place)
        setBudgetPassingScore(specialization?.budget_passing_score)
        setPaidPlace(specialization?.paid_place)
        setImgURL(specialization?.image)
    }, [specialization]);

    const handleDeleteSpecialization = async () => {
        await dispatch(deleteSpecialization(id))
        navigate("/specializations-table/")
    }

    if (!specialization) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
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
                        <Button color="success" className="fs-4" onClick={saveSpecialization}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteSpecialization}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default SpecializationEditPage