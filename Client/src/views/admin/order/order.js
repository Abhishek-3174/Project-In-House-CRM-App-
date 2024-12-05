import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getApi } from 'services/api'
import AddOrder from './components/addOrder'
import CheckTable from './components/CheckTable'
const Order = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = [
        { Header: 'Order ID', accessor: 'orderId' },
        { Header: "Student Program ID", accessor: "studentProgramId", },
        { Header: "Ordered Date", accessor: "orderedDate", }
    ];

    const handleClick = () => {
        onOpen()
    }

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/order/' : 'api/order/');
        setData(result.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>
            <Flex alignItems={'center'} justifyContent={"right"} flexWrap={'wrap'} mb={3}>
                <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Create Order</Button>
            </Flex>
            <CheckTable columnsData={columns} fetchData={fetchData} data={data} isLoding={isLoding} className='table-fix-container' />
            <AddOrder isOpen={isOpen} fetchData={fetchData} onClose={onClose} />
        </div>
    )
}

export default Order
