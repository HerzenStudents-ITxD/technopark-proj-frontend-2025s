import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Forma from "../components/Forma";
import Selector from '../components/Selector';
import { FormGroup } from 'react-bootstrap';

export default function TicketModal({
    show,
    handleClose,
    task,
    handleSave,
    isNew = false,
    onTitleChange,
    onStatusChange,
    onDescriptionChange,
    availableSprints = []
}) {
    const [status, setStatus] = useState(task?.status || "0");
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [selectedSprint, setSelectedSprint] = useState(task?.sprintId?.toString() || "");

    useEffect(() => {
        if (task) {
            setStatus(task.status);
            setTitle(task.title || "");
            setDescription(task.description || "");
            setSelectedSprint(task.sprintId?.toString() || "");
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave({ ...task, status, title, description, sprintId: selectedSprint ? parseInt(selectedSprint) : null });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? 'Создание задачи' : 'Редактирование задачи'}</Modal.Title>
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
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                onTitleChange?.(e.target.value);
                            }}
                            required
                            //readOnly={!isNew}
                        />
                    </Form.Group>

                    <FormGroup className="mb-3">
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
                            onChange={(e) => {
                                setStatus(e.target.value);
                                onStatusChange?.(e.target.value);
                            }}
                        >
                            <option value="0">Не начата</option>
                            <option value="1">В работе</option>
                            <option value="2">Завершена</option>
                        </Form.Select>
                    </FormGroup>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                onDescriptionChange?.(e.target.value);
                            }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn-main-color float-end' type="submit">
                        {isNew ? 'Создать' : 'Сохранить'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}