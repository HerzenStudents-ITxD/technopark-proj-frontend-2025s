import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Forma from "../components/Forma";
import Selector from '../components/Selector';

export default function TicketModal({show, handleClose, task, handleSave}) {
    const [status, setStatus] = useState(task?.status || "0");

    useEffect(() => {
        if (task) {
        setStatus(task.status);
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave({ ...task, status });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование задачи</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* <div className="mb-3">
                        <Forma
                            label="Название"
                            rows="1"
                            value={task?.title || ""}
                        />
                    </div> */}
                    <Form.Group className="mb-3">
                        <Form.Label>Название задачи</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={task?.title || ""} 
                            readOnly
                        />
                    </Form.Group>
                    <div className="mb-3">
                        {/* <Selector
                            label="Статус"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: "0", label: "Не начата" },
                                { value: "1", label: "В работе" },
                                { value: "2", label: "Завершена" },
                            ]}
                            sm1="4"
                            sm2="8"
                        /> */}
                        <Form.Label>Статус</Form.Label>
                        <Form.Select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="0">Не начата</option>
                            <option value="1">В работе</option>
                            <option value="2">Завершена</option>
                        </Form.Select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn-main-color float-end' type="submit">
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}