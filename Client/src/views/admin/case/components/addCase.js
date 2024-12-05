import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { CaseSchema } from 'schema/caseSchema';
import { getApi, postApi } from 'services/api';

const AddCase = (props) => {
    const { onClose, isOpen, fetchData } = props
    const [isChecked, setIsChecked] = useState(true);
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [assignmentToData, setAssignmentToData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);


    const initialValues = {
        subject: '',
        category: '',
        casecategory:'',
        casesubcategory: '',
        description: '',
        notes: '',
        assignmentTo: props.from === 'contact' && props.id ? props.id : '',
        assignmentToLead: props.from === 'lead' && props.id ? props.id : '',
        reminder: '',
        start: '',
        end: '',
        backgroundColor: '',
        borderColor: '#ffffff',
        textColor: '',
        display: '',
        url: '',
        createBy: userId,
    };
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: CaseSchema,
        onSubmit: (values, { resetForm }) => {
            AddData();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            console.log('Hi from case data')
            setIsLoding(true)
            let response = await postApi('api/cases/add', values)
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
    useEffect(() => {
        const fetchAssignmentToData = async () => {
            try {
                if (values.category === "contact") {
                    const result = await getApi('api/contact/');
                    setAssignmentToData(result?.data || []);
                } else if (values.category === "lead") {
                    const result = await getApi('api/lead/');
                    setAssignmentToData(result?.data || []);
                } else {
                    setAssignmentToData([]);
                }
            } catch (e) {
                console.error('Error fetching assignmentTo data:', e);
            }
        };

        fetchAssignmentToData();
    }, [values.category]);
    return (
        <Modal isOpen={isOpen} size={'xl'} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Create Case
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
                                Subject<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.subject}
                                name="subject"
                                placeholder='Subject'
                                fontWeight='500'
                                borderColor={errors?.subject && touched?.subject ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Related
                            </FormLabel>
                            <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('assignmentTo', null); setFieldValue('assignmentToLead', null); }} value={values.category}>
                                <Stack direction='row'>
                                    <Radio value='None' >None</Radio>
                                    <Radio value='contact'>Contact</Radio>
                                    <Radio value='lead'>Lead</Radio>
                                </Stack>
                            </RadioGroup>
                            <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: values.category === "None" ? 12 : 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Description
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                name="description"
                                placeholder='Description'
                                fontWeight='500'
                                borderColor={errors?.description && touched?.description ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.description && touched.description && errors.description}</Text>
                        </GridItem>
                        {values.category === "contact" ?
                            <>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Assignment To  Contact
                                    </FormLabel>
                                    <Flex justifyContent={'space-between'}>
                                        <Select
                                            value={values.assignmentTo}
                                            name="assignmentTo"
                                            onChange={handleChange}
                                            mb={errors.assignmentTo && touched.assignmentTo ? undefined : '10px'}
                                            fontWeight='500'
                                            placeholder={'Assignment To'}
                                            borderColor={errors.assignmentTo && touched.assignmentTo ? "red.300" : null}
                                        >
                                            {assignmentToData?.map((item) => {
                                                return <option value={item._id} key={item._id}>{values.category === 'contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                            })}
                                        </Select>
                                        <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                    </Flex>
                                    <Text mb='10px' color={'red'}> {errors.assignmentTo && touched.assignmentTo && errors.assignmentTo}</Text>
                                </GridItem>
                            </>
                            : values.category === "lead" ?
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            Assignment To Lead
                                        </FormLabel>
                                        <Flex justifyContent={'space-between'}>
                                            <Select
                                                value={values.assignmentToLead}
                                                name="assignmentToLead"
                                                onChange={handleChange}
                                                mb={errors.assignmentToLead && touched.assignmentToLead ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Assignment To'}
                                                borderColor={errors.assignmentToLead && touched.assignmentToLead ? "red.300" : null}
                                            >
                                                {assignmentToData?.map((item) => {
                                                    return <option value={item._id} key={item._id}>{values.category === 'contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                })}
                                            </Select>
                                            <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        </Flex>
                                        <Text mb='10px' color={'red'}> {errors.assignmentToLead && touched.assignmentToLead && errors.assignmentToLead}</Text>
                                    </GridItem>
                                </>
                                : ''
                        }
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Cateogry<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.casecategory}
                                name='casecategory'
                                placeholder='Category'
                                fontWeight='500'
                                borderColor={errors?.casecategory && touched?.casecategory ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.casecategory && touched.casecategory && errors.casecategory}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Sub-Cateogry<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.casesubcategory}
                                name='casesubcategory'
                                placeholder='Sub-Category'
                                fontWeight='500'
                                borderColor={errors?.casesubcategory && touched?.casesubcategory ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.casesubcategory && touched.casesubcategory && errors.casesubcategory}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Notes
                            </FormLabel>
                            <Textarea
                                resize={'none'}
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.notes}
                                name="notes"
                                placeholder='Notes'
                                fontWeight='500'
                                borderColor={errors?.notes && touched?.notes ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.notes && touched.notes && errors.notes}</Text>
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

export default AddCase