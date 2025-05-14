import { Card, Button } from 'react-bootstrap';
import { RecordFill } from "react-bootstrap-icons"

export default function CardSprint({ sprint, onDragStart, onDragOver, onDragLeave, onDrop, onTaskClick }) {
    return (
        <Card
            className="scroll-card"
            style={{ 
                border: "1px solid #68ACC6", 
                borderRadius: "0.7rem",
                minWidth: "250px",
                marginRight: "15px"
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Card.Body>
                <Card.Title>{sprint.title}</Card.Title>
                {sprint.tickets.map((ticket, index) => (
                    <Button
                        key={`${sprint.title}-${index}`}
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
            </Card.Body>
        </Card>
    );
}

// export default function CardSprint({ sprint, onDragStart, onDragOver, onDragLeave, onDrop }) {
//     return (
//         <Card
//             className="scroll-card"
//             style={{ 
//                 border: "1px solid #68ACC6", 
//                 borderRadius: "0.7rem",
//                 minWidth: "250px",
//                 marginRight: "15px"
//             }}
//             onDragOver={onDragOver}
//             onDragLeave={onDragLeave}
//             onDrop={onDrop}
//         >
//             <Card.Body>
//                 <Card.Title>{sprint.title}</Card.Title>
//                 {sprint.tickets.map((ticket, index) => (
//                     <Button
//                         key={`backlog-${index}`}
//                         className='ticket me-2 mb-2'
//                         draggable
//                         onDragStart={(e) => onDragStart(e, ticket)}
//                     >
//                         {ticket.title}
//                         {" "}
//                         <RecordFill 
//                             style={{color: ticket.status == 1 ? '#FFC546' : ticket.status == 2 ? '#5FD92A' : '#B3B3B3', fontSize: '25'}}
//                         />
//                     </Button>
//                 ))}
//             </Card.Body>
//         </Card>
//     );
// }