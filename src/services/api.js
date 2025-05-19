const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5132' : 'https://itvd.online/technopark-proj/api/';

export async function getProjects(search = '') {
    const response = await fetch(`${API_BASE_URL}/controller/project/all-projects?search=${encodeURIComponent(search)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
	console.log(API_BASE_URL);
    
    if (!response.ok) {
        throw new Error('Failed to get projects');
    }
    
    return await response.json();
}

export async function getInstitutes() {
    const response = await fetch(`${API_BASE_URL}/institute`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to get institutes');
    }
    
    return await response.json();
}

export async function getStudents() {
    const response = await fetch(`${API_BASE_URL}/student`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to get students');
    }
    
    return await response.json();
}

export async function getSchoolsByInstitute(instituteId) {
    const response = await fetch(`${API_BASE_URL}/school?instituteId=${instituteId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to get schools by institute');
    }
    
    return await response.json();
}

export const createProject = async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/controller/project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    
    return await response.json();
};

export const getProjectById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/controller/project/proj-by-id?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to get project by id');
    }
    return await response.json();
};

export const getStudentsBySchool = async (id) => {
	const response = await fetch(`${API_BASE_URL}/student/students-by-id?id=${id}`);
	if (!response.ok) {
        throw new Error('Failed to get students by school');
    }
    return await response.json();
};


export const updateTicketSprint = async (ticketId, newSprintId) => {
	const response = await fetch(`${API_BASE_URL}/controller/ticket/update-sprint?ticketId=${ticketId}`, {
		method: 'PUT',
		headers: {
            'Content-Type': 'application/json',
        },
		body: JSON.stringify(newSprintId)
	});
	if (!response.ok) {
        throw new Error('Failed to update ticket sprint');
    }
	return await response.json();
}

export const createTicket = async (ticketData) => {
    const response = await fetch(`${API_BASE_URL}/controller/ticket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create ticket');
    }
    
    return await response.json();
};

export const updateTicket = async (ticketId, ticketData) => {
    const response = await fetch(`${API_BASE_URL}/controller/ticket/update-ticket/${ticketId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update ticket');
    }
    
    return await response.json();
};

export const getProjectForEdit = async (id) => {
    const response = await fetch(`${API_BASE_URL}/controller/project/edit/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch project data');
    }
    return await response.json();
};

export const updateProject = async (id, projectData) => {
    const response = await fetch(`${API_BASE_URL}/controller/project/update-project/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update project');
    }
    
    return await response.json();
};