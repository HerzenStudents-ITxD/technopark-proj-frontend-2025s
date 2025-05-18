import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Label from "../components/Label";

export default function Selector(props) {
    const selectOptions = props.options?.map(option => ({
        value: option.value.toString(),
        label: option.label
    })) || [];

	const normalizedValue = () => {
		if (props.isMulti) {
			return selectOptions.filter(opt => props.value?.includes(opt.value));
		} else {
			if (!props.value) return null;
			
			// Handle both string and object values
			if (typeof props.value === 'object') {
				return selectOptions.find(opt => opt.value === props.value.value?.toString());
			}
			return selectOptions.find(opt => opt.value === props.value?.toString());
		}
	};

    return (
        <Row>
            <Col sm={props.sm1}>
                <Label label={props.label}/>
            </Col>
            <Col sm={props.sm2}>
                <Select
                    className="mb-3"
                    options={selectOptions}
					value={normalizedValue()}
                    onChange={props.onChange}
                    placeholder={props.placeholder || "Выберите..."}
					isMulti={props.isMulti}
					closeMenuOnSelect={!props.isMulti}
					hideSelectedOptions={false}
                    styles={{
                        control: (base, { isFocused }) => ({
                            ...base,
                            borderColor: isFocused ? '#68ACC6' : '#ced4da', // Граница в фокусе/обычном состоянии
                            boxShadow: isFocused ? '0 0 0 0.25rem rgba(104, 172, 198, 0.25)' : 'none', // Свечение
                            '&:hover': {
                                borderColor:'#68ACC6',
                                boxShadow:'0 0 0 0.25rem rgba(104, 172, 198, 0.25)'
                            }
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected 
                                ? '#68ACC6' 
                                : isFocused 
                                    ? 'rgba(104, 172, 198, 0.1)' 
                                    : 'white',
                            color: isSelected ? 'white' : 'black',
                            '&:active': {
                                backgroundColor: '#68ACC6',
                                color: 'white'
                            }
                        }),
						multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#E1F0F7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: '#2A6476',
                            fontWeight: '500'
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: '#2A6476',
                            ':hover': {
                                backgroundColor: '#C4E3F3',
                                color: '#1D4E5D'
                            }
                        })
                    }}
                />
            </Col>
        </Row>
    );
}