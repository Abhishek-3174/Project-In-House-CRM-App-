import { Button, Grid, GridItem, Flex, IconButton, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React from 'react'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'
import { BiLink } from 'react-icons/bi'
import { useEffect } from 'react'
import { useState } from 'react'
import { getApi } from 'services/api'
import Card from 'components/card/Card'
import { IoIosArrowBack } from "react-icons/io";


const CaseView = (props) => {
    const params = useParams()
    const { id } = params
    const user = JSON.parse(localStorage.getItem("user"))

    const [data, setData] = useState()
    const [isLoding, setIsLoding] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);

    const fetchViewData = async () => {
        if (id) {
            setIsLoding(true)
            let result = await getApi('api/cases/view/', id?.event ? id?.event?._def?.extendedProps?._id : id);
            setData(result?.data);
            setIsLoding(false)
        }
    }
    useEffect(() => {
        fetchViewData()
    }, [id, edit])


    const handleClick = () => {
        onOpen()
    }
    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} >
                    <Flex justifyContent={"right"}>
                        <Menu>
                            <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                Actions
                            </MenuButton>
                            <MenuDivider />
                            <MenuList>
                                <MenuItem onClick={() => handleClick()} icon={<AddIcon />}>Add</MenuItem>
                                <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>
                                {data?.role !== 'admin' && JSON.parse(localStorage.getItem('user'))?.role === 'admin' && <>
                                    <MenuDivider />
                                    <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                </>}
                            </MenuList>
                        </Menu>
                        <Link to="/task">
                            <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                Back
                            </Button>
                        </Link>
                    </Flex>
                </GridItem>
            </Grid>
            <Card>
                <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                    <GridItem colSpan={{ base: 12, md: 6 }} >
                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Subject </Text>
                        <Text>{data?.subject ? data?.subject : ' - '}</Text>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Case Category </Text>
                        <Text>{data?.category ? data?.category : ' - '}</Text>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Description </Text>
                        <Text>{data?.description ? data?.description : ' - '}</Text>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Notes </Text>
                        <Text>{data?.notes ? data?.notes : ' - '}</Text>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                        <Link to={data?.assignmentTo ? user?.role !== 'admin' ? `/contactView/${data?.assignmentTo}` : `/admin/contactView/${data?.assignmentTo}` : user?.role !== 'admin' ? `/leadView/${data?.assignmentToLead}` : `/admin/leadView/${data?.assignmentToLead}`}>
                            <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                        </Link>
                    </GridItem>
                </Grid>
            </Card>
            <Card mt={3}>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                    <GridItem colStart={6} >
                        <Flex justifyContent={"right"}>
                            <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>
                            {data?.role !== 'admin' && JSON.parse(localStorage.getItem('user'))?.role === 'admin' && <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                        </Flex>
                    </GridItem>
                </Grid>
            </Card>
        </div>
    )
}

export default CaseView
