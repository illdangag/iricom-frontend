// react
import { ButtonGroup, HStack, Button, } from '@chakra-ui/react';
// etc
import { ListResponse, } from '../interfaces';

type Props = {
  page: number,
  pageMaxLength?: number,
  listResponse: ListResponse,
  onClick?: (page: number) => void,
};

const Pagination = ({
  page,
  pageMaxLength = 5,
  listResponse,
  onClick = () => {},
}: Props) => {
  return (<HStack justifyContent='center' marginTop='0.4rem'>
    <ButtonGroup size='xs' variant='outline' isAttached>
      {listResponse.getPaginationList(pageMaxLength).map((pagination, index) => <Button key={index}
        backgroundColor={pagination === page ? 'gray.100' : 'transparent'}
        onClick={() => {
          onClick(pagination);
        }}>
        {pagination}
      </Button>)}
    </ButtonGroup>
  </HStack>);
};

export default Pagination;
