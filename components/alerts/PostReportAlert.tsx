// react
import { ChangeEventHandler, MouseEventHandler, useRef, useState, } from 'react';
import { useIricomAPI, } from '../../hooks';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, FormControl, FormLabel, Select, Textarea, useToast, } from '@chakra-ui/react';
// etc
import { IricomError, Post, ReportType, } from '../../interfaces';

enum ComponentState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
  post: Post,
}

const PostReportAlert = ({
  isOpen = false,
  onClose = () => {},
  post,
}: Props) => {
  const iricomAPI = useIricomAPI();
  const closeRef = useRef();
  const toast = useToast();

  const [state, setState,] = useState<ComponentState>(ComponentState.IDLE);
  const [reportType, setReportType,] = useState<ReportType>(ReportType.HATE);
  const [reason, setReason,] = useState<string>('');

  const onChangeReportType: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value: ReportType = event.target.value as ReportType;
    setReportType(value);
  };

  const onChangeReason: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const value: string = event.target.value;
    setReason(value);
  };

  const onClickReport: MouseEventHandler<HTMLButtonElement> = async () => {
    setState(ComponentState.REQUEST);
    const boardId: string = post.boardId;
    const postId: string = post.id;

    try {
      await iricomAPI.reportPost(boardId, postId, reportType, reason);
      toast({
        title: '게시물을 신고 하였습니다.',
        status: 'success',
        duration: 3000,
      });
      setReportType(ReportType.HATE);
      setReason('');
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      toast({
        title: iricomError.message,
        status: 'warning',
        duration: 3000,
      });
    } finally {
      setState(ComponentState.IDLE);
      onClose();
    }
  };

  return (
    <AlertDialog
      leastDestructiveRef={closeRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay/>
      <AlertDialogContent>
        <AlertDialogHeader>게시물 신고</AlertDialogHeader>
        <AlertDialogBody flexDirection='column'>
          <FormControl>
            <FormLabel>종류</FormLabel>
            <Select
              variant='outline'
              value={reportType}
              onChange={onChangeReportType}
              disabled={state === ComponentState.REQUEST}
            >
              <option value='hate'>혐오</option>
              <option value='pornography'>음란물</option>
              <option value='political'>정치</option>
              <option value='etc'>기타</option>
            </Select>
            <FormLabel marginTop='1.0rem'>사유</FormLabel>
            <Textarea
              value={reason}
              onChange={onChangeReason}
              disabled={state === ComponentState.REQUEST}
            />
          </FormControl>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup>
            <Button
              variant='ghost'
              ref={closeRef}
              isDisabled={state === ComponentState.REQUEST}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              onClick={onClickReport}
              isLoading={state === ComponentState.REQUEST}
            >
              신고
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostReportAlert;
