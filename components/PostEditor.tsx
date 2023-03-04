// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { Box, Button, ButtonGroup, Checkbox, Divider, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Text, Textarea, VStack, } from '@chakra-ui/react';
// etc
import { AccountAuth, Post, PostState, PostType, } from '../interfaces';

type Props = {
  defaultValue?: Post,
  disabled?: boolean,
  accountAuth: AccountAuth,
  onChange?: (title: string, content: string, postType: PostType, isDisabledComment: boolean, status: PostState) => void,
}

enum EditorState {
  INVALID,
  VALID,
}

const PostEditor = ({
  defaultValue = null,
  disabled = false,
  accountAuth,
  onChange = () => {
  },
}: Props) => {
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

  const onClickTemporary = () => {
    onChange(title, content, postType, disabledComment, PostState.TEMPORARY);
  };

  const onClickSave = () => {
    onChange(title, content, postType, disabledComment, PostState.POST);
  };

  return (
    <Box>
      <VStack alignItems='stretch' spacing='1rem'>
        <FormControl isRequired>
          <FormLabel>제목</FormLabel>
          <Input onChange={onChangeTitle}></Input>
        </FormControl>
        <FormControl>
          <FormLabel>내용</FormLabel>
          <Textarea onChange={onChangeContent}/>
        </FormControl>
      </VStack>
      {accountAuth === AccountAuth.SYSTEM_ADMIN && <>
        <Divider marginTop='.8rem'/>
        <VStack alignItems='stretch' spacing='1rem' marginTop='.8rem'>
          <Text>관리자 설정</Text>
          <FormControl>
            <RadioGroup defaultValue={DEFAULT_POST_TYPE} onChange={onChangePostType}>
              <HStack>
                <Radio size='sm' value={PostType.POST}>일반 게시물</Radio>
                <Radio size='sm' value={PostType.NOTIFICATION}>공지사항 게시물</Radio>
              </HStack>
            </RadioGroup>
            <FormHelperText>공지사항 게시물은 게시판 상단에 고정으로 나타납니다.</FormHelperText>
          </FormControl>
          <FormControl>
            <Checkbox size='sm' defaultChecked={DEFAULT_DISABLED_COMMENT} onChange={onChangeDisabledComment}>댓글 비활성화</Checkbox>
            <FormHelperText>댓글을 비활성화 하면 게시물에 댓글을 추가 할 수 없습니다.</FormHelperText>
          </FormControl>
        </VStack>
      </>}
      <HStack justifyContent='flex-end' marginTop='.8rem'>
        <ButtonGroup size='sm'>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID}
            onClick={onClickTemporary}
          >
            임시 저장
          </Button>
          <Button
            isDisabled={disabled || editorState === EditorState.INVALID}
            onClick={onClickSave}
          >
            작성
          </Button>
        </ButtonGroup>
      </HStack>
    </Box>
  );
};

export default PostEditor;
