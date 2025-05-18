import { useState, useEffect } from 'react';
import ButtonBack from "../components/ButtonBack";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import CardSprint from "../components/CardSprint";
import CardBacklog from "../components/CardBacklog";
import TicketModal from './TicketModal';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateTicketSprint, createTicket, updateTicket } from '../services/api';

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sprints, setSprints] = useState([]);
    const [backlogTickets, setBacklogTickets] = useState([]);
	const [backlogSprintId, setBacklogSprintId] = useState(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(id);
                if (response.projects && response.projects.length > 0) {
                    const projectData = response.projects[0];
                    setProject(projectData);
                    
                    // Преобразование данных спринтов и тикетов из API
                    const transformedSprints = projectData.sprints?.map(sprint => ({
                        id: sprint.id,
                        title: sprint.isBacklog ? "Бэклог" : `Спринт ${sprint.id}`,
                        isBacklog: sprint.isBacklog || false,
                        status: sprint.status,
                        tickets: sprint.tickets?.map(ticket => ({
                            id: ticket.id,
                            title: ticket.name,
                            status: ticket.status.toString(),
                            description: ticket.description
                        })) || []
                    })) || [];

                    // Ищем бэклог и обрабатываем его
                    const backlogSprint = transformedSprints.find(sprint => sprint.isBacklog);
					const regularSprints = transformedSprints.filter(sprint => !sprint.isBacklog);
                    let backlogFound = false;

					setSprints(regularSprints);
					setBacklogTickets(backlogSprint?.tickets || []);
					setBacklogSprintId(backlogSprint?.id || null); 
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
		e.dataTransfer.setData('source', JSON.stringify({
			type: source.type,
			sprintId: source.sprintId // using ID instead of title
		}));
	};
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

const handleDrop = async (e, target) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const ticketData = e.dataTransfer.getData('ticket');
    const sourceData = e.dataTransfer.getData('source');
    
    if (!ticketData || !sourceData) return;

    const ticket = JSON.parse(ticketData);
    const source = JSON.parse(sourceData);

    try {
        // Update backend first
        await updateTicketSprint(ticket.id, target.sprintId);
        
        // Remove from source (whether it's backlog or regular sprint)
        if (source.sprintId === backlogSprintId) {
            // If coming from backlog
            setBacklogTickets(prev => prev.filter(t => t.id !== ticket.id));
        } else {
            // If coming from regular sprint
            setSprints(prev => prev.map(sprint => {
                if (sprint.id === source.sprintId) {
                    return {
                        ...sprint,
                        tickets: sprint.tickets.filter(t => t.id !== ticket.id)
                    };
                }
                return sprint;
            }));
        }

        // Add to target
        if (target.sprintId === backlogSprintId) {
            setBacklogTickets(prev => [...prev, ticket]);
        } else {
            setSprints(prev => prev.map(sprint => {
                if (sprint.id === target.sprintId) {
                    return {
                        ...sprint,
                        tickets: [...sprint.tickets, ticket]
                    };
                }
                return sprint;
            }));
        }
    } catch (err) {
        console.error('Failed to update ticket sprint:', err);
    }
};

    const handleCreateTicket = async (newTicketData) => {
        try {
            // Находим ID бэклога (спринта с IsBacklog = true)
            const backlogSprint = project.sprints?.find(s => s.isBacklog);
            
            if (!backlogSprint) {
                throw new Error('Backlog sprint not found');
            }

            // Отправляем запрос на создание задачи
            const response = await createTicket({
                Name: newTicketData.title,
                Status: parseInt(newTicketData.status),
                Description: newTicketData.description,
                SprintId: backlogSprint.id // ID спринта-бэклога
            });

            // Обновляем локальное состояние
            const newTicket = {
                id: response.ticketId,
                title: response.ticketName,
                status: response.ticketStatus.toString(),
                description: response.ticketDescription
            };

            // Добавляем новую задачу в бэклог
            setBacklogTickets(prev => [...prev, newTicket]);
            
            return true;
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            return false;
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskSource, setTaskSource] = useState(null);

    const handleTaskClick = (task, source) => {
        setSelectedTask({
            ...task,
            sprintId: source.sprintId
        });
        setTaskSource(source);
        setShowModal(true);
    };

	const handleSaveTask = async (updatedTask) => {
        try {
            console.log(updatedTask);
            console.log(taskSource.type);
            const response = await updateTicket(updatedTask.id, {
                    Name: updatedTask.title,
                    Status: parseInt(updatedTask.status),
                    Description: updatedTask.description,
                    //SprintId: taskSource.type === 'backlog' ? null : taskSource.sprintId
                    SprintId: taskSource.sprintId
                });

            if (taskSource.type === 'backlog') {
                setBacklogTickets(prev => 
                    prev.map(t => t.id === updatedTask.id ? {
                        ...t,
                        title: updatedTask.title,
                        status: updatedTask.status,
                        description: updatedTask.description
                    } : t)
                );
            } else {
                setSprints(prev => 
                    prev.map(sprint => {
                        if (sprint.id === (updatedTask.sprintId || taskSource.sprintId)) {
                            return {
                                ...sprint,
                                tickets: sprint.tickets.map(t => 
                                    t.id === updatedTask.id ? {
                                        ...t,
                                        title: updatedTask.title,
                                        status: updatedTask.status,
                                        description: updatedTask.description
                                    } : t)
                            };
                        }
                        return sprint;
                    })
                );
            } 
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
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
                                key={sprint.id}
                                sprint={sprint}
                                index={index}
                                onTaskClick={(task) => handleTaskClick(task, { 
									type: 'sprint', 
									sprintId: sprint.id // using ID instead of title
								})}
                                onDragStart={(e, ticket) => handleDragStart(e, ticket, { 
									type: 'sprint', 
									sprintId: sprint.id // using ID instead of title
								})}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, { 
									sprintId: sprint.id
								})}
                            />
                        ))}
                    </div>
                </div>

                {/* Бэклог */}
				<CardBacklog
					tickets={backlogTickets}
					sprintId={backlogSprintId} // Pass the backlog sprint ID
					onTaskClick={(task) => handleTaskClick(task, { 
						type: 'backlog', 
						sprintId: backlogSprintId // Use the backlog sprint ID
					})}
					onDragStart={(e, ticket) => handleDragStart(e, ticket, { 
						type: 'backlog', 
						sprintId: backlogSprintId // Use the backlog sprint ID
					})}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={(e) => handleDrop(e, { 
						type: 'backlog',
						sprintId: backlogSprintId // Use the backlog sprint ID
					})}
                     onCreateTicket={handleCreateTicket}
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