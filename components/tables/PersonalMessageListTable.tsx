// react
import { TableContainer, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, Badge, Link, } from '@chakra-ui/react';
import Pagination from './Pagination';
import AccountNameTag from '../AccountNameTag';

// etc
import { PersonalMessageList, } from '@root/interfaces';
import { getFormattedDateTime, } from '@root/utils';

type Props = {
  personalMessageList: PersonalMessageList,
  page: number,
  pageLinkHref?: string,
  isShowNewBadge?: boolean,
  isShowSendAccount?: boolean,
  isShowReceiveAccount?: boolean,
  isShowReceivedConfirm?: boolean,
}

const PersonalMessageListTable = ({
  personalMessageList,
  page,
  pageLinkHref = '?page={{page}}',
  isShowNewBadge = false,
  isShowSendAccount = false,
  isShowReceiveAccount = false,
  isShowReceivedConfirm = false,
}: Props) => {
  return <VStack alignItems='stretch'>
    <TableContainer>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th width='5rem'>날짜</Th>
            <Th>제목</Th>
            {isShowSendAccount && <Th width='8rem'>보낸 사람</Th>}
            {isShowReceiveAccount && <Th width='8rem'>받은 사람</Th>}
            {isShowReceivedConfirm && <Th width='5rem'>수신 여부</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {personalMessageList.personalMessages.map((message) => {
            return <Tr key={'pm_' + message.id}>
              <Td>{getFormattedDateTime(message.createDate)}</Td>
              <Td>
                <Link href={`/message/${message.id}?type=${isShowSendAccount ? 'receive' : 'send'}`}>
                  {message.title}{isShowNewBadge && !message.receivedConfirm && <Badge fontSize='0.5rem' variant='outline' colorScheme='red' marginLeft='0.2rem'>NEW</Badge>}
                </Link>
              </Td>
              {isShowSendAccount && <Td><AccountNameTag account={message.sendAccount}/></Td>}
              {isShowReceiveAccount && <Td><AccountNameTag account={message.receiveAccount}/></Td>}
              {isShowReceivedConfirm && <Td>{message.receivedConfirm ? '읽음' : '읽지 않음'}</Td>}
            </Tr>;
          })}
        </Tbody>
      </Table>
    </TableContainer>
    <Box paddingTop='1rem'>
      <Pagination
        page={page}
        listResponse={personalMessageList}
        pageLinkHref={pageLinkHref}
      />
    </Box>
  </VStack>;
};

export default PersonalMessageListTable;
