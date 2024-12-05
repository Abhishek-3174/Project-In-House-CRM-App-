import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import CheckTable from './components/CheckTable'
import AddStudentProgram from './components/addStudentProgram'

const StudentProgram = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Student Program Name', accessor: 'studentProgramName' },
        { Header: "Student Name", accessor: "studentName", },
        { Header: "IsActive", accessor: "isActive", }
    ];

    const handleClick = () => {
        onOpen()
    }

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/studentprograms/' : 'api/studentprograms/');
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>
            <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Student Program</Button>
            </Flex>
            <CheckTable columnsData={columns} fetchData={fetchData} data={data} isLoding={isLoding} className='table-fix-container' />
            <AddStudentProgram isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
        </div>
    )
}

export default StudentProgram;
