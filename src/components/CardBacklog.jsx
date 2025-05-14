import { Card, Button } from 'react-bootstrap';
import { PlusLg } from "react-bootstrap-icons";
import { RecordFill } from "react-bootstrap-icons"

export default function CardBacklog({ tickets, onDragStart, onDragOver, onDragLeave, onDrop, onTaskClick }) {
    return (
        <Card 
            className='mt-5' 
            style={{ border: "1px solid #68ACC6", borderRadius: "0.7rem" }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Card.Body>
                <Card.Title>Бэклог</Card.Title>
                {tickets.map((ticket, index) => (
                    <Button
                        key={`backlog-${index}`}
                        className='ticket me-2 mb-2'
                        onClick={() => onTaskClick(ticket)}
                        draggable
                        onDragStart={(e) => onDragStart(e, ticket)}
                    >
                        {ticket.title}
                        {" "}
                        <RecordFill 
                            style={{color: ticket.status == 1 ? '#FFC546' : ticket.status == 2 ? '#5FD92A' : '#B3B3B3', fontSize: '25'}}
                        />
                    </Button>
                ))}
                <Button className='ticket mb-2'>
                    <PlusLg />
                </Button>
            </Card.Body>
        </Card>
    );
}