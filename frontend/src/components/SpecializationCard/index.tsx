import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Specialization} from "modules/types.ts";

interface SpecializationCardProps {
    specialization: T_Specialization,
    isMock: boolean
}

const SpecializationCard = ({specialization, isMock}: SpecializationCardProps) => {
    return (
        <Card key={specialization.id} style={{width: '18rem', margin: "0 auto 50px" }}>
            <CardImg
                src={isMock ? mockImage as string : specialization.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {specialization.name}
                </CardTitle>
                <CardText>
                    Цена: {specialization.price} руб.
                </CardText>
                <Link to={`/specializations/${specialization.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default SpecializationCard