import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text,Checkbox } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { getApi } from 'services/api'
import { useNavigate } from 'react-router-dom';

const EventView = (props) => {
    const { onClose, isOpen, info, fetchData } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (info) {
            setIsLoding(true)
            let result = await getApi('api/studentprograms/view/', info?.event ? info?.event?._def?.extendedProps?._id : info);
            setData(result?.data);
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [info])

    const handleViewOpen = () => {
        console.log(info)
        if (info?.event) {
            navigate(`/admin/studentprogram/view/${info?.event?._def?.extendedProps?._id}`)
        }
        else {
            navigate(user?.role !== 'admin' ? `/view/${info}` : `/admin/studentprogram/view/${info}`)
        }
    }
    return (
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Student Program
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Student Program Name </Text>
                                    <Text>{data?.studentProgramName ? data?.studentProgramName : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Student Name </Text>
                                    <Text>{data?.studentName ? data?.studentName : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Start Date </Text>
                                    <Text>{data?.startDate ? data?.startDate : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>End Date</Text>
                                    <Text>{data?.endDate ? data?.endDate : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>
                                        IsActive
                                    </Text>
                                    {data?.isActive !== undefined ? (
                                        <Checkbox isChecked={data.isActive} isDisabled>
                                        {data.isActive ? 'Active' : 'Inactive'}
                                        </Checkbox>
                                    ) : (
                                        <Text> - </Text>
                                    )}
                                </GridItem>

                            </Grid>

                        </ModalBody>
                        <DrawerFooter>
                            <IconButton variant='outline' onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />
                            <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />
                            <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />
                        </DrawerFooter>
                    </>}
            </ModalContent>
        </Modal>
    )
}

export default EventView
