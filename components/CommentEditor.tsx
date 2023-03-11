// react
import { ChangeEvent, useState, useEffect, } from 'react';
import { Box, Button, HStack, Textarea, } from '@chakra-ui/react';
import { RequireLoginAlert, } from '../components/alerts';
import { useIricomAPI, } from '../hooks';
// etc
import { NotExistTokenError, Comment, } from '../interfaces';

enum EditorState {
  INVALID,
  VALID,
  REQUEST,
}

type Props = {
  boardId: string,
  postId: string,
  referenceCommentId?: string,
  autoFocus?: boolean,
  onChange?: (comment: Comment) => void,
};

const CommentEditor = ({
  boardId,
  postId,
  referenceCommentId = null,
  autoFocus = false,
  onChange = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [state, setState,] = useState<EditorState>(EditorState.INVALID);
  const [commentContent, setCommentContent,] = useState<string>('');
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (commentContent && commentContent.length > 0) {
      setState(EditorState.VALID);
    } else {
      setState(EditorState.INVALID);
    }
  }, [commentContent,]);

  const onChangeCommentContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(event.target.value);
  };

  const onClickConfirm = () => {
    setState(EditorState.REQUEST);

    void iricomAPI.createComment(boardId, postId, commentContent, referenceCommentId)
      .then((comment: Comment) => {
        onChange(comment);
      })
      .catch((error) => {
        if (error instanceof NotExistTokenError) {
          setShowLoginAlert(true);
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        setCommentContent('');
      });
  };

  return (
    <Box>
      <Textarea autoFocus={autoFocus} resize='none' value={commentContent} onChange={onChangeCommentContent} isDisabled={state === EditorState.REQUEST}/>
      <HStack justifyContent='flex-end' paddingTop='1rem'>
        <Button size='sm' isDisabled={state === EditorState.INVALID || state === EditorState.REQUEST} onClick={onClickConfirm}>작성</Button>
      </HStack>
      <RequireLoginAlert
        isOpen={showLoginAlert}
        text='댓글을 쓰기 위해서는 로그인이 필요합니다.'
        successURL={`/boards/${boardId}/posts/${postId}`}
      />
    </Box>
  );
};

export default CommentEditor;
