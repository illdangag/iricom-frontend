// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { Box, Button, ButtonGroup, Checkbox, Divider, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Text, Textarea, VStack, } from '@chakra-ui/react';
import { useIricomAPI, } from '../hooks';
// etc
import { AccountAuth, Post, PostState, PostType, } from '../interfaces';

type Props = {
  defaultValue?: Post,
  disabled?: boolean,
  accountAuth: AccountAuth,
  boardId?: string,
  onRequest?: (status: PostState, post: Post) => void,
}

enum EditorState {
  INVALID,
  VALID,
  REQUEST,
}

const PostEditor = ({
  defaultValue = null,
  disabled = false,
  accountAuth,
  boardId = '',
  onRequest = () => {
  },
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [editorState, setEditorState,] = useState<EditorState>(EditorState.INVALID);
  const [title, setTitle,] = useState<string>(defaultValue ? defaultValue.title : '');
  const [content, setContent,] = useState<string>(defaultValue ? defaultValue.content : '');
  const DEFAULT_POST_TYPE: PostType = defaultValue ? defaultValue.type : PostType.POST;
  const [postType, setPostType,] = useState<PostType>(DEFAULT_POST_TYPE);
  const DEFAULT_DISABLED_COMMENT: boolean = defaultValue ? !defaultValue.isAllowComment : false;
  const [disabledComment, setDisabledComment,] = useState<boolean>(DEFAULT_DISABLED_COMMENT);

  useEffect(() => {
    if (title.length > 0) {
      setEditorState(EditorState.VALID);
    } else {
      setEditorState(EditorState.INVALID);
    }
  }, [title,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const onChangePostType = (value: PostType) => {
    setPostType(value);
  };

  const onChangeDisabledComment = (event: ChangeEvent<HTMLInputElement>) => {
    setDisabledComment(event.target.checked);
  };

  const onClickTemporary = async () => {
    setEditorState(EditorState.REQUEST);
    const post: Post = await savePost();
    setEditorState(EditorState.VALID);
    onRequest(PostState.TEMPORARY, post);
  };

  const onClickSave = async () => {
    setEditorState(EditorState.REQUEST);
    let post: Post = await savePost();
    post = await publishPost(post);
    setEditorState(EditorState.VALID);
    onRequest(PostState.PUBLISH, post);
  };

  const savePost = async (): Promise<Post> => {
    const postId: string | null = defaultValue ? defaultValue.id : null;
    if (postId === null) {
      return await iricomAPI.createPost(boardId, title, content, postType, !disabledComment);
    } else {
      return await iricomAPI.updatePost(boardId, postId, title, content, postType, !disabledComment);
    }
  };

  const publishPost = async (post: Post): Promise<Post> => {
    return await iricomAPI.publishPost(post.boardId, post.id);
  };

  return (
    <Box>
      <VStack alignItems='stretch' spacing='1rem'>
        <FormControl isRequired>
          <FormLabel>??????</FormLabel>
          <Input value={title} disabled={disabled || editorState === EditorState.REQUEST} onChange={onChangeTitle}></Input>
        </FormControl>
        <FormControl>
          <FormLabel>??????</FormLabel>
          <Textarea value={content} disabled={disabled || editorState === EditorState.REQUEST} onChange={onChangeContent}/>
        </FormControl>
      </VStack>
      {accountAuth === AccountAuth.SYSTEM_ADMIN && <>
        <Divider marginTop='.8rem'/>
        <VStack alignItems='stretch' spacing='1rem' marginTop='.8rem'>
          <Text>????????? ??????</Text>
          <FormControl>
            <RadioGroup defaultValue={DEFAULT_POST_TYPE} isDisabled={disabled || editorState === EditorState.REQUEST} onChange={onChangePostType}>
              <HStack>
                <Radio size='sm' value={PostType.POST}>?????? ?????????</Radio>
                <Radio size='sm' value={PostType.NOTIFICATION}>???????????? ?????????</Radio>
              </HStack>
            </RadioGroup>
            <FormHelperText>???????????? ???????????? ????????? ????????? ???????????? ???????????????.</FormHelperText>
          </FormControl>
          <FormControl>
            <Checkbox size='sm' defaultChecked={DEFAULT_DISABLED_COMMENT} isDisabled={disabled || editorState === EditorState.REQUEST} onChange={onChangeDisabledComment}>?????? ????????????</Checkbox>
            <FormHelperText>????????? ???????????? ?????? ???????????? ????????? ?????? ??? ??? ????????????.</FormHelperText>
          </FormControl>
        </VStack>
      </>}
      <HStack justifyContent='flex-end' marginTop='.8rem'>
        <ButtonGroup size='sm'>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID || editorState === EditorState.REQUEST}
            onClick={onClickTemporary}
          >
            ?????? ??????
          </Button>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID || editorState === EditorState.REQUEST}
            onClick={onClickSave}
          >
            ??????
          </Button>
        </ButtonGroup>
      </HStack>
    </Box>
  );
};

export default PostEditor;
