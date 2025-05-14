import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "react-bootstrap-icons";

export default function ButtonBack({ link }) {
    const navigate = useNavigate();

    return (
        <Button
            variant="link"
            className="btn-custom-back
                        text-black 
                        p-0 border-0 
                        bg-transparent 
                        text-decoration-none 
                        d-flex 
                        align-items-center 
                        gap-1
                        mt-4
                        ms-5"
            onClick={(e) => navigate(link)}
        >
            <ChevronLeft />
            Вернуться
        </Button>
    );

}