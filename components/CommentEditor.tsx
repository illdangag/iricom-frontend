// react
import { ChangeEvent, useState, useEffect, } from 'react';
import { Box, Button, HStack, Textarea, } from '@chakra-ui/react';
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
      .catch((error: Error) => {
        if (!(error instanceof NotExistTokenError)) {
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
    </Box>
  );
};

export default CommentEditor;
