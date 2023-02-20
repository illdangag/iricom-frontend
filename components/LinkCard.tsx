import NextLink from 'next/link';
import { LinkBox, Heading, LinkOverlay, Text, } from '@chakra-ui/react';

type Props = {
  title?: string,
  description?: string[],
  href?: string,
};

const LinkCard = ({
  title,
  description = [],
  href = '#',
}: Props) => {
  return (
    <LinkBox as='article' rounded='md' backgroundColor='white' padding='1rem' width='100%'>
      <Heading size='sm'>
        <LinkOverlay as={NextLink} href={href}>
          {title}
        </LinkOverlay>
        {description.map((item, index) => <Text fontSize='sm' fontWeight='normal' marginTop='0.4rem' key={index}>{item}</Text>)}
      </Heading>
    </LinkBox>
  );
};

export default LinkCard;
