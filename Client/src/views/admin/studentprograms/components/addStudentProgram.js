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

const AddStudentProgram = (props) => {
    const { onClose, isOpen, fetchData } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Fetch available programs and students for the lookup fields
        const fetchLookups = async () => {
            try {
                const programResponse = await getApi('api/program/'); // Replace with your API endpoint
                const studentResponse = await getApi('api/contact/'); // Replace with your API endpoint
                if (programResponse.status === 200) setPrograms(programResponse.data);
                if (studentResponse.status === 200) setStudents(studentResponse.data);
            } catch (error) {
                console.error('Error fetching lookup data:', error);
            }
        };
        fetchLookups();
    }, []);

    const initialValues = {
        studentProgramName: '',
        programId: '',
        studentId: '',
        studentName: '',
        startDate: '',
        endDate: '',
        isActive: true,
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
            let response = await postApi('api/studentprograms/add', values);
            if (response.status === 200) {
                resetForm();
                onClose();
                fetchData();
            }
        } catch (e) {
            console.error('Error adding student program:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent="space-between" display="flex">
                    Create Student Program
                    <IconButton onClick={onClose} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                Program Name<Text color="red">*</Text>
                            </FormLabel>
                            <Select
                                fontSize="sm"
                                name="studentProgramName"
                                placeholder="Select Program"
                                onChange={(e) => {
                                    const selectedProgram = programs.find((p) => p._id === e.target.value);
                                    setFieldValue('studentProgramName', selectedProgram?.programname || '');
                                    setFieldValue('programId', selectedProgram?._id || '');
                                }}
                                onBlur={handleBlur}
                                value={values.programId}
                                borderColor={errors?.programId && touched?.programId ? 'red.300' : null}
                            >
                                {programs.map((program) => (
                                    <option key={program._id} value={program._id}>
                                        {program.programname}
                                    </option>
                                ))}
                            </Select>
                            <Text color="red">{errors.programId && touched.programId && errors.programId}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                Student Name<Text color="red">*</Text>
                            </FormLabel>
                            <Select
                                fontSize="sm"
                                name="studentId"
                                placeholder="Select Student"
                                onChange={(e) => {
                                    const selectedStudent = students.find((student) => student._id === e.target.value);
                                    setFieldValue('studentId', selectedStudent?._id || '');
                                    setFieldValue(
                                        'studentName',
                                        `${selectedStudent?.firstName || ''} ${selectedStudent?.lastName || ''}`.trim()
                                    );
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
                                Start Date<Text color="red">*</Text>
                            </FormLabel>
                            <Input
                                type="date"
                                fontSize="sm"
                                name="startDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.startDate}
                                borderColor={errors?.startDate && touched?.startDate ? 'red.300' : null}
                            />
                            <Text color="red">{errors.startDate && touched.startDate && errors.startDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                                End Date<Text color="red">*</Text>
                            </FormLabel>
                            <Input
                                type="date"
                                fontSize="sm"
                                name="endDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.endDate}
                                borderColor={errors?.endDate && touched?.endDate ? 'red.300' : null}
                            />
                            <Text color="red">{errors.endDate && touched.endDate && errors.endDate}</Text>
                        </GridItem>

                        <GridItem colSpan={12}>
                            <Checkbox
                                isChecked={values.isActive}
                                name="isActive"
                                onChange={() => setFieldValue('isActive', !values.isActive)}
                            >
                                Is Active
                            </Checkbox>
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

export default AddStudentProgram;
