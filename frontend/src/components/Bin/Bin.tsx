import {Link} from "react-router-dom";
import {Badge, Button} from "reactstrap";

type Props = {
    isActive: boolean,
    draft_applicant_id: string,
    specializations_count: number
}

export const Bin = ({isActive, draft_applicant_id, specializations_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="w-50" disabled>Корзина</Button>
    }

    return (
        <Link to={`/applicants/${draft_applicant_id}/`} className="w-50">
            <Button color={"primary"} className="w-100 bin">
                Корзина
                <Badge>
                    {specializations_count}
                </Badge>
            </Button>
        </Link>
    )
}