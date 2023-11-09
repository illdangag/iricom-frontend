// react
import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Text,
  Button, Link, } from '@chakra-ui/react';
// etc
import { Post, } from '../../interfaces';

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
  post: Post,
}

const PostPublishAlert = ({
  isOpen = false,
  onClose = () => {},
  post,
}: Props) => {
  const closeRef = useRef();

  return (
    <AlertDialog
      leastDestructiveRef={closeRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size='xs'
    >
      <AlertDialogOverlay/>
      <AlertDialogContent>
        <AlertDialogHeader>게시물 발행</AlertDialogHeader>
        <AlertDialogBody>
          <Text>게시물이 발행되었습니다.</Text>
          <Text>게시물로 이동하시겠습니까?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button as={Link} href={`/boards/${post.boardId}/posts/${post.id}`}>
            게시물로 이동
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostPublishAlert;
