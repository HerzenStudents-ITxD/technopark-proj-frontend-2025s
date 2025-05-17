import { Card, Button, ProgressBar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getProjects } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CardProj() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.projects);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    //let projArr = config;
    return (
        <div className='row' style={{marginTop:'4%'}}>
            {projects.map((project) => (
                <div className='col-4' style={{marginBottom:'4%'}} key={project.projectId}>
                    <Card
                        style={{ width: '22rem', height:'40vh', border: "1px solid #68ACC6"}}
                        onClick={(e) => navigate('/project')}
                    >
                        <Card.Body className="d-flex flex-column">
                            <Card.Text className='main-color text-uppercase'>{project.semester?"Осень":"Весна"}{" "}{project.year}</Card.Text>
                            <Card.Title>{project.projectName}</Card.Title>
                            <Card.Text className='mt-4' style={{height:'10vh'}}>
                                {project.description}
                            </Card.Text>
                            <div>
                                <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>{project.instituteName}</Button>
                                <Button className='me-2 main-color btn-border text-uppercase btn-border-custom'>{project.schoolName}</Button>
                                <Button className='main-color btn-border text-uppercase btn-border-custom'>{project.course} курс</Button>
                            </div>
                            <div className='mt-auto pb-2'>
                                <ProgressBar 
                                    style={{ 
                                        height: '4px', 
                                        backgroundColor: '#E4EFF4' 
                                     }} 
                                    now={project.projectProgress} 
                                >
                                <ProgressBar 
                                    style={{ 
                                    backgroundColor: '#68ACC6',
                                    width: `${project.projectProgress}%`
                                    }} 
                                />
                                </ProgressBar>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    )
}