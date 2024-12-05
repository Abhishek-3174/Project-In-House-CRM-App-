import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import CheckTable from './components/CheckTable'
import AddProgram from './components/addProgram'

const Program = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Program Name', accessor: 'programname' },
        { Header: "Program ID", accessor: "programid", }
    ];

    const handleClick = () => {
        onOpen()
    }

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/program/' : 'api/program/');
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>
            <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Program</Button>
            </Flex>
            <CheckTable columnsData={columns} fetchData={fetchData} data={data} isLoding={isLoding} className='table-fix-container' />
            <AddProgram isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
        </div>
    )
}

export default Program
