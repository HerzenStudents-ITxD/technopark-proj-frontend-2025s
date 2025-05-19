import { Card, Button } from 'react-bootstrap';
import { PlusLg } from "react-bootstrap-icons";
import { RecordFill } from "react-bootstrap-icons"
import { useState } from 'react';
import TicketModal from '../pages/TicketModal';

export default function CardBacklog({ 
    tickets, 
    onDragStart, 
    onDragOver, 
    onDragLeave, 
    onDrop, 
    onTaskClick,
    onCreateTicket
}) {
    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({
        title: '',
        status: '0',
        description: ''
    });

    const handleCreateClick = () => {
        setNewTicket({
            title: '',
            status: '0',
            description: ''
        });
        setShowModal(true);
    };

    const handleSaveNewTicket = async (ticketData) => {
        const success = await onCreateTicket(ticketData);
        if (success) {
            setShowModal(false);
        }
    };

    return (
        <>
            <Card 
                className='mt-5 mb-5' 
                style={{ border: "1px solid #68ACC6", borderRadius: "0.7rem" }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <Card.Body>
                    <Card.Title>Бэклог</Card.Title>
                    {tickets.map((ticket, index) => (
                        <Button
                            key={`backlog-${ticket.id}`}
                            className='ticket me-2 mb-2'
                            onClick={() => onTaskClick(ticket, { type: 'backlog' })}
                            draggable
                            onDragStart={(e) => onDragStart(e, ticket, { type: 'backlog' })}
                        >
                            {ticket.title}
                            {" "}
                            <RecordFill 
                                style={{color: ticket.status == 1 ? '#FFC546' : ticket.status == 2 ? '#5FD92A' : '#B3B3B3', fontSize: '25'}}
                            />
                        </Button>
                    ))}
                    <Button
                        className='ticket mb-2'
                        onClick={handleCreateClick}
                    >
                        <PlusLg />
                    </Button>
                </Card.Body>
            </Card>

            <TicketModal 
                show={showModal}
                handleClose={() => setShowModal(false)}
                task={newTicket}
                handleSave={handleSaveNewTicket}
                isNew={true}
                onTitleChange={(title) => setNewTicket({...newTicket, title})}
                onStatusChange={(status) => setNewTicket({...newTicket, status})}
                onDescriptionChange={(description) => setNewTicket({...newTicket, description})}
            />
        </>
    );
}