import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
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
            let result = await getApi('api/cases/view/', info?.event ? info?.event?._def?.extendedProps?._id : info);
            setData(result?.data);
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [info])

    const handleViewOpen = () => {
        if (info?.event) {
            navigate(`/admin/caseView/view/${info?.event?._def?.extendedProps?._id}`)
        }
        else {
            navigate(`/admin/caseView/view/${info}`)
        }
    }
    return (
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Case
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Subject </Text>
                                    <Text>{data?.subject ? data?.subject : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Related To </Text>
                                    <Text>{data?.category ? data?.category : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Category </Text>
                                    <Text>{data?.category ? data?.category : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Sub-Category  </Text>
                                    <Text>{data?.subcategory ? data?.subcategory : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Link </Text>
                                    {data?.url ?
                                        <a target='_blank' href={data?.url}>
                                            <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                        </a> : '-'
                                    }
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case reminder </Text>
                                    <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                                    <Link to={data?.assignmentTo ? user?.role !== 'admin' ? `/contactView/${data?.assignmentTo}` : `/admin/contactView/${data?.assignmentTo}` : user?.role !== 'admin' ? `/leadView/${data?.assignmentToLead}` : `/admin/leadView/${data?.assignmentToLead}`}>
                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                                    </Link>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case createBy </Text>
                                    <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Description</Text>
                                    <Text>{data?.description ? data?.description : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case notes </Text>
                                    <Text>{data?.notes ? data?.notes : ' - '}</Text>
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
