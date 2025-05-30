import ButtonBack from "../components/ButtonBack";
import Forma from "../components/Forma";
import Selector from "../components/Selector";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getInstitutes, getStudents, getSchoolsByInstitute, createProject, getStudentsBySchool, getProjectForEdit, updateProject } from '../services/api';
import { useParams } from 'react-router-dom';

const EditProjectPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);

    const [institutes, setInstitutes] = useState([]);
	const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [selectedInstituteId, setSelectedInstituteId] = useState(null);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [error, setError] = useState(null);
    const [durationValue, setDurationValue] = useState(7);

    // Состояния для хранения данных формы
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        course: 1, // по умолчанию 1 курс
        year: new Date().getFullYear(),
        sprintDuration: durationValue,
        startDate: new Date().toISOString().split('T')[0], // текущая дата
        instituteId: null,
		schoolId: null,
        studentIds: []
    });

    useEffect(() => {
            const fetchInstitutes = async () => {
                try {
                    const response = await getInstitutes();
                    setInstitutes(response.institutes);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchInstitutes();
        }, []);

    useEffect(() => {
            const fetchAllStudents = async () => {
                try {
                    const response = await getStudents();
                    setAllStudents(response.students);
					setFilteredStudents(response.students);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchAllStudents();
        }, []);

    useEffect(() => {
        if (selectedInstituteId) {
            const fetchSchools = async () => {
                try {
                    const response = await getSchoolsByInstitute(selectedInstituteId);
                    setSchools(response.schools);
                    setFormData(prev => ({...prev, instituteId: parseInt(selectedInstituteId)}));
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchSchools();
        } else {
            setSchools([]);
        }
    }, [selectedInstituteId]);

	useEffect(() => {
		if (selectedSchoolId) {
			const fetchStudentsBySchool = async () => {
				try {
					const response = await getStudentsBySchool(selectedSchoolId);
					setFilteredStudents(response.students);
					setFormData(prev => ({...prev, schoolId: parseInt(selectedSchoolId)}));
					
					// Remove students that don't belong to the selected school
					setFormData(prev => ({
						...prev,
						studentIds: prev.studentIds.filter(id => 
							response.students.some(student => student.studentId === parseInt(id))
						)
					}));
				} catch (err) {
					setError(err.message);
				}
			};
			fetchStudentsBySchool();
		} else {
			// If no school selected, show all students
			setFilteredStudents(allStudents);
			setFormData(prev => ({...prev, schoolId: null}));
		}
	}, [selectedSchoolId, allStudents]);

     useEffect(() => {
        const fetchData = async () => {
            try {
                const institutesResponse = await getInstitutes();
                setInstitutes(institutesResponse.institutes);
                
                const studentsResponse = await getStudents();
                setAllStudents(studentsResponse.students);
                
                if (isEditMode) {
                    const projectResponse = await getProjectForEdit(id);
                    const project = projectResponse.project;
                    

                    if (projectResponse.project) {  // ⚠️ Добавьте проверку!
                        setFormData({
                            name: projectResponse.project.name || '',  // Защита от undefined
                            description: projectResponse.project.description || '',
                            course: projectResponse.project.course || 1,
                            year: projectResponse.project.year || new Date().getFullYear(),
                            semester: projectResponse.project.semester,
                            sprintDuration: projectResponse.project.sprintDuration || 7,
                            startDate: projectResponse.project.startDate || new Date().toISOString().split('T')[0],
                            instituteId: projectResponse.project.instituteId || null,
                            schoolId: projectResponse.project.schoolId || null,
                            studentIds: projectResponse.project.studentIds ? projectResponse.project.studentIds.map(id => id.toString()) : []
                        });
                    }

                    console.log(projectResponse.project.instituteId);
                    // Устанавливаем выбранные институт и направление

                    setSelectedInstituteId(projectResponse.project.instituteId);
                    if (projectResponse.project.schoolId) {
                        const schoolsResponse = await getSchoolsByInstitute(projectResponse.project.instituteId);
                        setSchools(schoolsResponse.schools);
                        setSelectedSchoolId(projectResponse.project.schoolId.toString());
                        
                        const studentsResponse = await getStudentsBySchool(projectResponse.project.schoolId);
                        setFilteredStudents(studentsResponse.students);
                    }
                }
            } catch (err) {
                setError(err.message);
            }
        };
        
        fetchData();
    }, [id, isEditMode]);

    const validateForm = () => {
        if (!formData.name) {
            setError('Название проекта обязательно');
            return false;
        }
        if (!formData.schoolId) {
            setError('Необходимо выбрать направление');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSelectChange = (name, value) => {
		if (name === 'studentIds') {
			setFormData(prev => {
				// Get the newly selected option value (last item in the array)
				const newValue = value[value.length - 1]?.value;
				
				// If no new value (like when clearing), return empty array
				if (!newValue) {
					return {...prev, [name]: []};
				}
				
				// Check if this student is already selected
				const isAlreadySelected = prev.studentIds.includes(newValue);
				
				// If already selected, return previous state unchanged
				if (isAlreadySelected) {
					return prev;
				}
				
				// Otherwise add the new student to the selection
				return {
					...prev,
					[name]: [...prev.studentIds, newValue]
				};
			});
		} else {
			// For other fields, keep the single value behavior
			setFormData(prev => ({...prev, [name]: parseInt(value)}));
		}
	};

    const handleDateChange = (e) => {
        setFormData(prev => ({...prev, startDate: e.target.value}));
    };
	
	const handleRemoveStudent = (studentIdToRemove) => {
		setFormData(prev => ({
			...prev,
			studentIds: prev.studentIds.filter(id => id !== studentIdToRemove)
		}));
	};

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const projectData = {
                Name: formData.name,
                Description: formData.description,
                Course: formData.course,
                Year: formData.year,
                SprintDuration: formData.sprintDuration,
                StartDate: formData.startDate,
                InstituteId: formData.instituteId,
                SchoolId: formData.schoolId,
                StudentIds: formData.studentIds.map(id => parseInt(id)), 
                Semester: formData.semester
            };

            if (isEditMode) {
                await updateProject(id, projectData);
                alert('Проект успешно обновлен!');
            } else {
                await createProject(projectData);
                alert('Проект успешно создан!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ButtonBack link="/" />

            <h3 className="mt-4" style={{marginLeft: '16vw'}}>{isEditMode ? 'Редактирование проекта' : 'Создание проекта'}</h3>

            <div className="mt-5" style={{marginLeft: '25vw', marginRight: '25vw'}}>
                <Forma
                    label="Название"
                    rows="1"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <Forma
                    label="Описание"
                    rows="2"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <Selector
                    label="Институт"
                    options={institutes.map(institute => ({
                        value: institute.instituteId.toString(),
                        label: institute.instituteName
                    }))}
					value={formData.instituteId ? {
						value: formData.instituteId.toString(),
						label: institutes.find(i => i.instituteId === formData.instituteId)?.instituteName || ''
					} : null}
                    onChange={(selectedOption) => {
                        setSelectedInstituteId(selectedOption.value);
                        setSelectedSchoolId(null); // Reset school selection
						handleSelectChange('instituteId', selectedOption.value);
                    }}
                    sm1="4"
                    sm2="8"
                />
                <Row>
                    <Col sm="8">
                        {schools && (<Selector
                            label="Направление"
                            options={schools.map(school => ({
                                value: school.schoolId.toString(),
                                label: school.schoolName
                            }))}
							value={formData.schoolId ? {
								value: formData.schoolId.toString(),
								label: schools.find(s => s.schoolId === formData.schoolId)?.schoolName || ''
							} : null}
                            onChange={(selectedOption) => {
                                setSelectedSchoolId(selectedOption.value);
                                handleSelectChange('schoolId', selectedOption.value);
                            }}
                            isDisabled={!selectedInstituteId}
                            sm1="6"
                            sm2="6"
                        />)}
                    </Col>
                    <Col sm="4">
                        <Selector
                            label="Курс"
                            options={[
                                { value: "1", label: "1" },
                                { value: "2", label: "2" },
                                { value: "3", label: "3" },
                                { value: "4", label: "4" },
                            ]}
							value={formData.course ? {
								value: formData.course.toString(),
								label: formData.course.toString()
							} : null}
                            onChange={(selectedOption) => handleSelectChange('course', selectedOption.value)}
                            sm1="4"
                            sm2="8"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm="8">
                        <Selector
                            label="Семестр"
                            options={[
                                { value: "1", label: "Весна" },
                                { value: "2", label: "Осень" },
                            ]}
							value={formData.semester ? {
								value: formData.semester.toString(),
								label: formData.semester === 1 ? "Весна" : "Осень"
							} : null}
							onChange={(selectedOption) => handleSelectChange('semester', selectedOption.value)}
                            sm1="6"
                            sm2="6"
                        />
                    </Col>
                    <Col sm="4">
                        <Selector
                            label="Год"
                            options={[
                                { value: "2022", label: "2022" },
                                { value: "2023", label: "2023" },
                                { value: "2024", label: "2024" },
                                { value: "2025", label: "2025" },
                            ]}
                            value={formData.year ? {
								value: formData.year.toString(),
								label: formData.year.toString()
							} : null}
							onChange={(selectedOption) => handleSelectChange('year', selectedOption.value)}
                            sm1="4"
                            sm2="8"
                        />
                    </Col>
                </Row>
                <Selector
					label="Студенты"
					options={formData.schoolId && Array.isArray(filteredStudents) ? filteredStudents.map(student => ({
						value: student.studentId.toString(),
						label: student.fullName,
					})) : []}
					onChange={(selectedOptions) => {
						handleSelectChange('studentIds', selectedOptions);
					}}
					isMulti={true}
					isSearchable={true}
					hideSelectedOptions={false}
					sm1="4"
					sm2="8"
					value={Array.isArray(formData.studentIds) ? formData.studentIds.map(id => {
						const student = allStudents.find(s => s.studentId.toString() === id);
						return {
							value: id,
							label: student ? `${student.fullName} (ID: ${id})` : id
						};
					}): []}
					placeholder={formData.schoolId ? "Выберите студентов" : "Сначала выберите направление"}
				/>
				{formData.studentIds.length > 0 && (
                    <div className="mt-2 mb-3">
                        <small className="text-muted">Выбрано студентов: {formData.studentIds.length}</small>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {formData.studentIds.map(id => {
                                const student = allStudents.find(s => s.studentId.toString() === id);
                                return student ? (
                                    <span key={id} className="ticket text-dark fw-normal badge p-2 d-flex align-items-center">
                                        {student.fullName}
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-black ms-2" 
                                            style={{fontSize: '0.5rem'}}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveStudent(id);
                                            }}
                                            aria-label={`Удалить ${student.fullName}`}
                                        />
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
				
                <Row>
                    <Col sm="8">
                        <Selector
                            label="Длительность спринта"
                            options={[
                                { value: "7", label: "1 неделя" },
                                { value: "14", label: "2 недели" },
                            ]}
							value={formData.sprintDuration ? {
								value: formData.sprintDuration.toString(),
								label: formData.sprintDuration === 7 ? "1 неделя" : "2 недели"
							} : null}
							
                            onChange={(selectedOption) => {
                                setDurationValue(selectedOption.value);
                                handleSelectChange('sprintDuration', selectedOption.value);
                            }}
                            sm1="6"
                            sm2="6"
                        />
                    </Col>
                    <Col sm="4">
                        <Row className="mb-3">
                            <Col sm="4">
                                <label htmlFor="startDate" className="form-label">Старт</label>
                            </Col>
                            <Col sm="8">
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={handleDateChange}
                                />
                            </Col>
                        </Row>
                        {/* <Selector
                            label="Дата начала"
                            options={[
                                { value: "1", label: "эээ" },
                                { value: "2", label: "ааа" },
                                { value: "3", label: "как" },
                                { value: "4", label: "сделать" },
                            ]}
                            sm1="5"
                            sm2="7"
                        /> */}
                    </Col>
                </Row>

                {error && <div className="alert alert-danger">{error}</div>}

                <Button
                    className='btn-main-color float-end mt-5'
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </div>


            {/* <div className="mt-5" style={{marginLeft: '25vw', marginRight: '25vw'}}>
                <Forma rows="1"/>
                <Forma rows="2"/>
                <Selector 
                    label="Институт"
                    options={[
                        { value: "1", label: "Институт 1" },
                        { value: "2", label: "Институт 2" },
                    ]}
                    //value={selectedValue}  // Если нужно управляемое состояние
                    //onChange={(e) => setSelectedValue(e.target.value)}
                />
                <div>
                    <Row>
                        <Col md="4">
                            <Selector 
                                label="Направление"
                                options={[
                                    { value: "1", label: "Направление 1" },
                                    { value: "2", label: "Направление 2" },
                                ]}
                            />
                        </Col>
                        <Col md="4">
                            <Selector 
                                label="Курс"
                                options={[
                                    { value: "1", label: "1" },
                                    { value: "2", label: "2" },
                                ]}
                            />
                        </Col>
                    </Row>
                </div>
            </div> */}
        </>
    )
}

export default EditProjectPage;