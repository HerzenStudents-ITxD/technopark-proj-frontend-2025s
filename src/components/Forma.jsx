import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Label from "../components/Label";

export default function Forma(props) {
    const handleChange = (e) => {
        // Вызываем переданный из родителя обработчик изменений
        if (props.onChange) {
            props.onChange(e);
        }
    };
    return (
        <Form>
            <FormGroup className="mb-3">
                <Row>
                    <Col sm="4">
                        <Label label={props.label}/>
                    </Col>
                    <Col sm="8">
                        <Form.Control
                            name={props.name}
                            onChange={handleChange}
                            as="textarea"
                            rows={props.rows}
                            className="custom-focus"
                            value={props.value}
                        />
                    </Col>
                </Row>
            </FormGroup>
        </Form>
    );
}