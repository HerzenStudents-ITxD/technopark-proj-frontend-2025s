import { useState } from 'react';
import ButtonBack from "../components/ButtonBack";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import CardSprint from "../components/CardSprint";
import CardBacklog from "../components/CardBacklog";
import TicketModal from './TicketModal';
import { useNavigate } from 'react-router-dom';

const ProjectPage = () => {
    const navigate = useNavigate();
    // Инициализируем спринты и бэклог
    const [sprints, setSprints] = useState([
        { 
            title: "Спринт 1", 
            tickets: [
                { title: "Задача спринта 1", status: "1" },
                { title: "Задача спринта 2", status: "0" }
            ] 
        },
        { 
            title: "Спринт 2", 
            tickets: [
                { title: "Задача спринта 3", status: "2" }
            ] 
        },
        { title: "Спринт 3", tickets: [] },
        { title: "Спринт 4", tickets: [] },
        { title: "Спринт 5", tickets: [] },
    ]);

    const [backlogTickets, setBacklogTickets] = useState([
        { title: "Задача 1", status: "0" },
        { title: "Задача 2", status: "1" },
        { title: "Задача 3", status: "2" },
    ]);

    // Обработчики для drag and drop
    const handleDragStart = (e, ticket, source) => {
        e.dataTransfer.setData('ticket', JSON.stringify(ticket));
        e.dataTransfer.setData('source', JSON.stringify(source));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const ticketData = e.dataTransfer.getData('ticket');
        const sourceData = e.dataTransfer.getData('source');
        
        if (!ticketData || !sourceData) return;

        const ticket = JSON.parse(ticketData);
        const source = JSON.parse(sourceData);

        // Удаляем задачу из исходного места
        if (source.type === 'backlog') {
            setBacklogTickets(prev => prev.filter(t => t.title !== ticket.title));
        } else {
            setSprints(prev => prev.map(sprint => {
                if (sprint.title === source.sprintTitle) {
                    return {
                        ...sprint,
                        tickets: sprint.tickets.filter(t => t.title !== ticket.title)
                    };
                }
                return sprint;
            }));
        }

        // Добавляем задачу в новое место
        if (target.type === 'backlog') {
            setBacklogTickets(prev => [...prev, ticket]);
        } else {
            setSprints(prev => prev.map(sprint => {
                if (sprint.title === target.sprintTitle) {
                    return {
                        ...sprint,
                        tickets: [...sprint.tickets, ticket]
                    };
                }
                return sprint;
            }));
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskSource, setTaskSource] = useState(null);

    const handleTaskClick = (task, source) => {
        setSelectedTask(task);
        setTaskSource(source);
        setShowModal(true);
    };

    const handleSaveTask = (updatedTask) => {
        if (taskSource.type === 'backlog') {
            setBacklogTickets(prev => 
            prev.map(t => t.title === updatedTask.title ? updatedTask : t)
            );
        } else {
            setSprints(prev => 
            prev.map(sprint => {
                if (sprint.title === taskSource.sprintTitle) {
                return {
                    ...sprint,
                    tickets: sprint.tickets.map(t => 
                    t.title === updatedTask.title ? updatedTask : t)
                    };
                }
                return sprint;
            })
            );
        }
    };

    return (
        <>
            <ButtonBack link="/" />

            <div className="mt-5" style={{ marginLeft: '20vw', marginRight: '20vw' }}>
                <Row>
                    <Col><div className="main-color btn-border text-uppercase">Весна 2025</div></Col>
                    <Col><Button
                        className='btn-main-color float-end'
                        onClick={(e) => navigate('/project/edit')}
                    >
                        Редактировать
                    </Button></Col>

                </Row>
                <h3 className="mt-3">Название проекта</h3>
                <Row className="mt-3">
                    <Col sm="8"><div>Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта</div></Col>
                </Row>

                <div className="mt-3">
                    <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>ИНСТИТУТ</Button>
                    <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>НАПРАВЛЕНИЕ</Button>
                    <Button className='main-color btn-border text-uppercase btn-border-custom'>1 КУРС</Button>
                </div>

                <div className="mt-3">Студенты: </div>

                {/* Спринты */}
                <div className="horizontal-scroll-container mt-4">
                    <div className="horizontal-scroll-wrapper">
                        {sprints.map((sprint, index) => (
                            <CardSprint
                                key={index}
                                sprint={sprint}
                                onTaskClick={(task) => handleTaskClick(task, { 
                                type: 'sprint', 
                                sprintTitle: sprint.title 
                                })}
                                onDragStart={(e, ticket) => handleDragStart(e, ticket, { 
                                    type: 'sprint', 
                                    sprintTitle: sprint.title 
                                })}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, { 
                                    type: 'sprint', 
                                    sprintTitle: sprint.title 
                                })}
                            />
                        ))}
                    </div>
                </div>

                {/* Бэклог */}
                <CardBacklog
                    tickets={backlogTickets}
                    onTaskClick={(task) => handleTaskClick(task, { 
                    type: 'backlog' 
                    })}
                    onDragStart={(e, ticket) => handleDragStart(e, ticket, { 
                        type: 'backlog' 
                    })}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, { 
                        type: 'backlog' 
                    })}
                />

                {/* Модальное окно */}
                <TicketModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    task={selectedTask}
                    handleSave={handleSaveTask}
                />
            </div>

        </>
    );
}

export default ProjectPage;