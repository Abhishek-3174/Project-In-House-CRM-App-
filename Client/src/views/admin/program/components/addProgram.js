import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { TaskSchema } from 'schema';
import { getApi, postApi } from 'services/api';

const AddTask = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [isChecked, setIsChecked] = useState(true);
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [assignmentToData, setAssignmentToData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);


    const initialValues = {
       programname : '',
       programid : ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: TaskSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            let response = await postApi('api/program/add', values)
            if (response.status === 200) {
                formik.resetForm()
                onClose();
                fetchData()
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };


    return (
        <Modal isOpen={isOpen} size={'xl'} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Create Program
                    <IconButton onClick={() => props.from ? onClose(false) : onClose()} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>
                    {/* Contact Model  */}
                    <ContactModel isOpen={contactModelOpen} onClose={setContactModel} fieldName='assignmentTo' setFieldValue={setFieldValue} />
                    {/* Lead Model  */}
                    <LeadModel isOpen={leadModelOpen} onClose={setLeadModel} fieldName='assignmentToLead' setFieldValue={setFieldValue} />

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Program Name<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.programname}
                                name="programname"
                                placeholder='Program Name'
                                fontWeight='500'
                                borderColor={errors?.programname && touched?.programname ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.programname && touched.programname && errors.programname}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: values.category === "None" ? 12 : 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Program ID
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.programid}
                                name="programid"
                                placeholder='Program ID'
                                fontWeight='500'
                                borderColor={errors?.programid && touched?.programid ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.programid && touched.programid && errors.programid}</Text>
                        </GridItem>
                    </Grid>

                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' disabled={isLoding ? true : false} onClick={AddData}>{isLoding ? <Spinner /> : 'Add'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Clear</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddTask
