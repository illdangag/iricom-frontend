// react
import { ChangeEvent, useState, useEffect, } from 'react';
import { Box, Button, HStack, Textarea, } from '@chakra-ui/react';
import { useIricomAPI, } from '../hooks';
// etc

enum EditorState {
  INVALID,
  VALID,
  REQUEST,
}

type Props = {
  boardId: string,
  postId: string,
  referenceCommentId?: string,
};

const CommentEditor = ({
  boardId,
  postId,
  referenceCommentId = null,
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
      .then(comment => {
        console.log(comment);
      })
      .catch(() => {

      })
      .finally(() => {
        setCommentContent('');
      });
  };

  return (
    <Box>
      <Textarea resize='none' value={commentContent} onChange={onChangeCommentContent} isDisabled={state === EditorState.REQUEST}/>
      <HStack justifyContent='flex-end' paddingTop='1rem'>
        <Button size='sm' isDisabled={state === EditorState.INVALID || state === EditorState.REQUEST} onClick={onClickConfirm}>작성</Button>
      </HStack>
    </Box>
  );
};

export default CommentEditor;
