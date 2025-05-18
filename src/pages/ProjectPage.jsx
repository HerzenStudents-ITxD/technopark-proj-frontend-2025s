import { useState, useEffect } from 'react';
import ButtonBack from "../components/ButtonBack";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import CardSprint from "../components/CardSprint";
import CardBacklog from "../components/CardBacklog";
import TicketModal from './TicketModal';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById } from '../services/api';

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sprints, setSprints] = useState([]);
    const [backlogTickets, setBacklogTickets] = useState([]);
    // Инициализируем спринты и бэклог
    // const [sprints, setSprints] = useState([
    //     { 
    //         title: "Спринт 1", 
    //         tickets: [
    //             { title: "Задача спринта 1", status: "1" },
    //             { title: "Задача спринта 2", status: "0" }
    //         ] 
    //     },
    //     { 
    //         title: "Спринт 2", 
    //         tickets: [
    //             { title: "Задача спринта 3", status: "2" }
    //         ] 
    //     },
    //     { title: "Спринт 3", tickets: [] },
    //     { title: "Спринт 4", tickets: [] },
    //     { title: "Спринт 5", tickets: [] },
    // ]);

    // const [backlogTickets, setBacklogTickets] = useState([
    //     { title: "Задача 1", status: "0" },
    //     { title: "Задача 2", status: "1" },
    //     { title: "Задача 3", status: "2" },
    // ]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(id);
                if (response.projects && response.projects.length > 0) {
                    const projectData = response.projects[0];
                    setProject(projectData);
                    
                    // Преобразование данных спринтов и тикетов из API
                    // Здесь нужно адаптировать под вашу структуру данных
                    const transformedSprints = projectData.sprints?.map(sprint => ({
                        id: sprint.id, // сохраняем ID спринта
                        title: sprint.name, // сохраняем название спринта
                        isBacklog: sprint.isBacklog || false, // добавляем флаг бэклога
                        tickets: sprint.tickets?.map(ticket => ({
                            id: ticket.id,
                            title: ticket.name,
                            status: ticket.status.toString()
                        })) || []
                    })) || [];

                    // Ищем бэклог и обрабатываем его
                    let filteredSprints = [...transformedSprints];
                    let backlogFound = false;

                    for (let i = 0; i < transformedSprints.length; i++) {
                        const sprint = transformedSprints[i];
                        
                        if (sprint.isBacklog) {
                            // Устанавливаем тикеты бэклога
                            setBacklogTickets(sprint.tickets || []);
                            // Удаляем бэклог из массива спринтов
                            filteredSprints = transformedSprints.filter(s => !s.isBacklog);
                            backlogFound = true;
                            break;
                        }
                    }

                    // Если бэклог не найден, используем все спринты
                    if (!backlogFound) {
                        filteredSprints = transformedSprints;
                    }

                    // Устанавливаем спринты (без бэклога, если он был)
                    setSprints(filteredSprints);
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchProject();
    }, [id]);

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

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!project) return <div>Проект не найден</div>;

    return (
        <>
            <ButtonBack link="/" />

            <div className="mt-5" style={{ marginLeft: '20vw', marginRight: '20vw' }}>
                <Row>
                    <Col>
                        <div className="main-color btn-border text-uppercase">
                            {project.semester ? "Осень" : "Весна"} {project.year}
                        </div>
                    </Col>
                    <Col>
                        <Button
                            className='btn-main-color float-end'
                            onClick={(e) => navigate('/project/${id}/edit')}
                        >
                            Редактировать
                        </Button>
                    </Col>
                </Row>
                <h3 className="mt-3">{project.projectName}</h3>
                <Row className="mt-3">
                    <Col sm="8"><div>{project.description}</div></Col>
                </Row>

                <div className="mt-3">
                    <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>{project.instituteName}</Button>
                    <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>{project.schoolName}</Button>
                    <Button className='main-color btn-border text-uppercase btn-border-custom'>{project.course} КУРС</Button>
                </div>

                <div className="mt-3">
                    Студенты: {project.students?.map(student => (
                        <span key={student.id} className="me-2">
                            {student.name}
                        </span>
                    ))} 
                </div>

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