import { CloseIcon } from '@chakra-ui/icons';
import {
    Button,
    Checkbox,
    FormLabel,
    Grid,
    GridItem,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { postApi, getApi } from 'services/api';

const AddOrder = (props) => {
    const { onClose, isOpen, fetchData } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);

    useEffect(() => {
        // Fetch students for the lookup
        const fetchStudents = async () => {
            try {
                const studentResponse = await getApi('api/contact/'); // Replace with your API endpoint
                if (studentResponse.status === 200) setStudents(studentResponse.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const fetchStudentPrograms = async (studentId) => {
        try {
            const response = await getApi(`api/contact/studentprograms/${studentId}`); // Fetch programs for the specific student
            if (response.status === 200) {
                setSelectedPrograms(response.data.length > 0 ? response.data : [{ _id: '', programname: 'No programs available' }]);
            } else {
                setSelectedPrograms([{ _id: '', programname: 'No programs available' }]);
            }
        } catch (error) {
            console.error('Error fetching student programs:', error);
            setSelectedPrograms([{ _id: '', programname: 'No programs available' }]);
        }
    };

    const initialValues = {
        studentId: '',
        studentProgramId: '',
        studentName:'',
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            await AddData(values);
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue } = formik;

    const AddData = async (values) => {
        try {
            setIsLoading(true);
            let response = await postApi('api/order/add', values); // Replace with your API endpoint
            if (response.status === 200) {
                resetForm();
                onClose();
                fetchData();
            }
        } catch (e) {
            console.error('Error adding order record:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent="space-between" display="flex">
                    Create Order
                    <IconButton onClick={onClose} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                Student Name<Text color="red">*</Text>
                            </FormLabel>
                            <Select
                                fontSize="sm"
                                name="studentId"
                                placeholder="Select Student"
                                onChange={(e) => {
                                    const studentId = e.target.value;
                                    setFieldValue('studentId', studentId);
                                    const selectedStudent = students.find((student) => student._id === studentId);
                                    if (selectedStudent) {
                                        setFieldValue(
                                            'studentName',
                                            `${selectedStudent.firstName} ${selectedStudent.lastName}`.trim()
                                        );
                                    }
                                    fetchStudentPrograms(studentId); // Fetch programs for the selected student
                                }}
                                onBlur={handleBlur}
                                value={values.studentId}
                                borderColor={errors?.studentId && touched?.studentId ? 'red.300' : null}
                            >
                                {students.map((student) => (
                                    <option key={student._id} value={student._id}>
                                        {`${student.firstName} ${student.lastName}`}
                                    </option>
                                ))}
                            </Select>
                            <Text color="red">{errors.studentId && touched.studentId && errors.studentId}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                Student Program<Text color="red">*</Text>
                            </FormLabel>
                            <Select
                                fontSize="sm"
                                name="studentProgramId"
                                placeholder="Select Program"
                                onChange={(e) => setFieldValue('studentProgramId', e.target.value)}
                                onBlur={handleBlur}
                                value={values.studentProgramId}
                                borderColor={errors?.studentProgramId && touched?.studentProgramId ? 'red.300' : null}
                            >
                                {selectedPrograms.map((program) => (
                                    <option key={program._id} value={program._id}>
                                        {program.studentProgramName}
                                    </option>
                                ))}
                            </Select>
                            <Text color="red">{errors.studentProgramId && touched.studentProgramId && errors.studentProgramId}</Text>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                Ordered Date<Text color="red">*</Text>
                            </FormLabel>
                            <Input
                                type="date"
                                fontSize="sm"
                                name="orderedDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.orderedDate}
                                borderColor={errors?.orderedDate && touched?.orderedDate ? 'red.300' : null}
                            />
                            <Text color="red">{errors.orderedDate && touched.orderedDate && errors.orderedDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Order Value<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.orderValue}
                                name="orderValue"
                                placeholder='Order Value'
                                fontWeight='500'
                                borderColor={errors?.orderValue && touched?.orderValue ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.orderValue && touched.orderValue && errors.orderValue}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button variant="brand" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? <Spinner /> : 'Add'}
                    </Button>
                    <Button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                    >
                        Clear
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddOrder;
