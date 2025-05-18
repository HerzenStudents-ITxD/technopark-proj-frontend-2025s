const API_BASE_URL = 'http://localhost:5132';

export async function getProjects(search = '') {
    const response = await fetch(`${API_BASE_URL}/controller/project/all-projects?search=${encodeURIComponent(search)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
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
        throw new Error('Failed to fetch projects');
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
        throw new Error('Failed to fetch projects');
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
        throw new Error('Failed to fetch projects');
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
        throw new Error('Ошибка при создании проекта');
    }
    
    return await response.json();
};

export const getProjectById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/controller/project/proj-by-id?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    return await response.json();
};

export const getStudentsBySchool = async (id) => {
	const response = await fetch(`${API_BASE_URL}/student/students-by-id?id=${id}`);
	if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    return await response.json();
};