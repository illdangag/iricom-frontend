// react
import { useState, } from 'react';
import {} from '@chakra-ui/react';

// etc
import { PersonalMessageList, PersonalMessage, } from '@root/interfaces';
import { getFormattedDateTime, } from '@root/utils';

type Props = {
  personalMessageList: PersonalMessageList,
  page: number,
  pageLinkHref?: string,
}

const PersonalMessageListTable = ({
  personalMessageList,
  page,
  pageLinkHref = '?page={{page}}',
}: Props) => {
  return <>
  </>;
};

export default PersonalMessageListTable;
