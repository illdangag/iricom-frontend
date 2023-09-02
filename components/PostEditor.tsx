// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { Box, Button, ButtonGroup, Checkbox, Divider, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Text, VStack, } from '@chakra-ui/react';
import { useIricomAPI, } from '../hooks';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

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
  onRequest = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [editorState, setEditorState,] = useState<EditorState>(EditorState.INVALID);
  const [title, setTitle,] = useState<string>(defaultValue ? defaultValue.title : '');
  const [content, setContent,] = useState<string>(defaultValue ? defaultValue.content : '');
  const DEFAULT_POST_TYPE: PostType = defaultValue ? defaultValue.type : PostType.POST;
  const [postType, setPostType,] = useState<PostType>(DEFAULT_POST_TYPE);
  const DEFAULT_DISABLED_COMMENT: boolean = defaultValue ? !defaultValue.allowComment : false;
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

  const onChangeEditor = (value: string) => {
    setContent(value);
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
          <FormLabel>제목</FormLabel>
          <Input value={title} disabled={disabled || editorState === EditorState.REQUEST} onChange={onChangeTitle}></Input>
        </FormControl>
        <FormControl>
          <FormLabel>내용</FormLabel>
          <Box>
            <MDEditor
              height={500}
              value={content}
              defaultValue={content}
              onChange={onChangeEditor}
            />
          </Box>
        </FormControl>
      </VStack>
      {(accountAuth === AccountAuth.SYSTEM_ADMIN || accountAuth === AccountAuth.BOARD_ADMIN) && <>
        <Divider marginTop='.8rem'/>
        <VStack alignItems='stretch' spacing='1rem' marginTop='.8rem'>
          <Text>관리자 설정</Text>
          <FormControl>
            <RadioGroup defaultValue={DEFAULT_POST_TYPE} isDisabled={disabled || editorState === EditorState.REQUEST} onChange={onChangePostType}>
              <HStack>
                <Radio size='sm' value={PostType.POST}>일반 게시물</Radio>
                <Radio size='sm' value={PostType.NOTIFICATION}>공지사항 게시물</Radio>
              </HStack>
            </RadioGroup>
            <FormHelperText>공지사항 게시물은 게시판 상단에 고정으로 나타납니다.</FormHelperText>
          </FormControl>
          <FormControl>
            <Checkbox size='sm' defaultChecked={DEFAULT_DISABLED_COMMENT} isDisabled={disabled || editorState === EditorState.REQUEST} onChange={onChangeDisabledComment}>댓글 비활성화</Checkbox>
            <FormHelperText>댓글을 비활성화 하면 게시물에 댓글을 추가 할 수 없습니다.</FormHelperText>
          </FormControl>
        </VStack>
      </>}
      <HStack justifyContent='flex-end' marginTop='.8rem'>
        <ButtonGroup size='sm'>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID || editorState === EditorState.REQUEST}
            onClick={onClickTemporary}
          >
            임시 저장
          </Button>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID || editorState === EditorState.REQUEST}
            onClick={onClickSave}
          >
            발행
          </Button>
        </ButtonGroup>
      </HStack>
    </Box>
  );
};

export default PostEditor;
