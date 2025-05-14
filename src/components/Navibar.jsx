import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

export default function NaviBar() {
    const navigate = useNavigate();
    return (
    <div className='mt-3'>
        <Navbar collapseOnSelect expand="lg">
            <Container>
                <Navbar.Brand>
                    <img 
                        src={logo}
                        width="153"
                        height="32"
                        alt="Технопарк Проекты логотип"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ms-auto'>
                        <Button
                            className='btn-main-color'
                            onClick={(e) => navigate('/project/edit')}
                        >
                            Создать проект
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
    );
}