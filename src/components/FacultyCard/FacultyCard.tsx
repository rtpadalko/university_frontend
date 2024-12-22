import {Button, Card, CardBody, CardTitle, Col} from "reactstrap";
import {Link} from "react-router-dom";
import {T_Faculty} from "modules/types.ts";

type Props = {
    faculty: T_Faculty
}

export const FacultyCard = ({faculty}:Props) => {
    return (
        <Card key={faculty.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={faculty.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {faculty.name}
                </CardTitle>
                <Col className="d-flex justify-content-between">
                    <Link to={`/faculties/${faculty.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                </Col>
            </CardBody>
        </Card>
    );
};