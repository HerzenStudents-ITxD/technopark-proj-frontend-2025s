import ButtonBack from "../components/ButtonBack";
import Forma from "../components/Forma";
import Selector from "../components/Selector";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getInstitutes, getStudents, getSchoolsByInstitute, createProject, getStudentsBySchool } from '../services/api';

const EditProjectPage = () => {
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
                StudentIds: formData.studentIds.map(id => parseInt(id))
            };

            await createProject(projectData);
            alert('Проект успешно создан!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <ButtonBack link="/" />

            <h3 className="mt-4" style={{marginLeft: '16vw'}}>Редактор проекта</h3>

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
                    onChange={(selectedOption) => {
                        setSelectedInstituteId(selectedOption.value);
                        setSelectedSchoolId(null); // Reset school selection
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
                            onChange={(selectedOption) => handleSelectChange('year', selectedOption.value)}
                            sm1="4"
                            sm2="8"
                        />
                    </Col>
                </Row>
                <Selector
					label="Студенты"
					options={formData.schoolId ? filteredStudents.map(student => ({
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
					value={formData.studentIds.map(id => {
						const student = allStudents.find(s => s.studentId.toString() === id);
						return {
							value: id,
							label: student ? `${student.fullName} (ID: ${id})` : id
						};
					})}
					placeholder={formData.schoolId ? "Выберите студентов" : "Сначала выберите направление"}
				/>
				{formData.studentIds.length > 0 && (
                    <div className="mt-2 mb-3">
                        <small className="text-muted">Выбрано студентов: {formData.studentIds.length}</small>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {formData.studentIds.map(id => {
                                const student = allStudents.find(s => s.studentId.toString() === id);
                                return student ? (
                                    <span key={id} className="badge bg-info text-dark p-2 d-flex align-items-center">
                                        {student.fullName}
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white ms-2" 
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
                >
                    Сохранить изменения
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