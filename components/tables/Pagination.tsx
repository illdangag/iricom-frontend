// react
import { ButtonGroup, HStack, Button, LinkOverlay, } from '@chakra-ui/react';
// etc
import { ListResponse, } from '../../interfaces';

type Props = {
  page: number,
  pageMaxLength?: number,
  listResponse: ListResponse,
  pageLinkHref?: string,
  onClickPage?: (page: number) => void,
};

const Pagination = ({
  page,
  pageMaxLength = 5,
  pageLinkHref = '?page={{page}}',
  listResponse,
  onClickPage = () => {},
}: Props) => {
  return (<HStack justifyContent='center' marginTop='0.4rem'>
    <ButtonGroup size='xs' variant='outline' isAttached>
      {listResponse.getPaginationList(pageMaxLength).map((pagination, index) => <Button
        key={index}
        variant={pagination === page ? 'solid' : 'outline'}
        onClick={() => {
          onClickPage(pagination);
        }}
      >
        {pageLinkHref && <LinkOverlay href={pageLinkHref.replaceAll('{{page}}', '' + pagination)}>
          {pagination}
        </LinkOverlay>}
        {!pageLinkHref && pagination}
      </Button>)}
    </ButtonGroup>
  </HStack>);
};

export default Pagination;
