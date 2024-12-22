import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Specialization} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteSpecialization} from "store/slices/specializationsSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    specializations:T_Specialization[]
}

const SpecializationsTable = ({specializations}:Props) => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (specialization_id) => {
        navigate(`/specializations/${specialization_id}`)
    }

    const openpRroductEditPage = (specialization_id) => {
        navigate(`/specializations/${specialization_id}/edit`)
    }

    const handleDeleteSpecialization = async (specialization_id) => {
        dispatch(deleteSpecialization(specialization_id))
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Название',
                accessor: 'name',
                Cell: ({ value }) => value
            },
            {
                Header: 'Цена',
                accessor: 'price',
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "edit_button",
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => openpRroductEditPage(cell.row.values.id)}>Редактировать</Button>
                )
            },
            {
                Header: "Удалить",
                accessor: "delete_button",
                Cell: ({ cell }) => (
                    <Button color="danger" onClick={() => handleDeleteSpecialization(cell.row.values.id)}>Удалить</Button>
                )
            }
        ],
        []
    )

    if (!specializations.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={specializations} onClick={handleClick} />
    )
};

export default SpecializationsTable