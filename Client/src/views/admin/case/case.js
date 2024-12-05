import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import CheckTable from './components/CheckTable'
import AddCase from './components/addCase'

const Case = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 5
        },
        { Header: 'Subject', accessor: 'subject' },
        { Header: "Related", accessor: "relatedTo", },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Sub Category', accessor: 'subCategory' },
        { Header: "Assignment To", accessor: "assignmentToName", },
        { Header: 'Status', accessor: 'status' },
    ];

    const handleClick = () => {
        onOpen()
    }

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/cases/' : `api/cases/?createBy=${user._id}`);
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>
            <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Case</Button>
            </Flex>
            <CheckTable columnsData={columns} fetchData={fetchData} data={data} isLoding={isLoding} className='table-fix-container' />
            <AddCase isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
        </div>
    )
}

export default Case
