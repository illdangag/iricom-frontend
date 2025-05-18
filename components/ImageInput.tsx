import { ChangeEvent, MutableRefObject, useRef, useState, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Text, } from '@chakra-ui/react';
import { ButtonProps, } from '@chakra-ui/button';

type Props = {
  maxImageSize?: number,
  inputRef?: MutableRefObject<HTMLInputElement>,
} & ButtonProps;

const ImageInput = (props: Props) => {
  const maxImageSize: number = props.maxImageSize !== undefined ? props.maxImageSize : 1024 * 1024 * 1;
  const inputRef: MutableRefObject<HTMLInputElement> = props.inputRef !== undefined ? props.inputRef : useRef();
  const onChange: (event: ChangeEvent<HTMLInputElement>) => void = props.onChange !== undefined ? props.onChange : () => {};

  const [isImageInputAlertOpen, setImageInputAlertOpen,] = useState<boolean>(false);

  const onClickAttachedImageButton = () => {
    inputRef.current.click();
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      if (file.size > maxImageSize) {
        setImageInputAlertOpen(true);
        event.target.value = null;
        return;
      }
      onChange(event);
    }
  };

  const onCloseImageInputAlert = () => {
    setImageInputAlertOpen(false);
  };

  return <Box display='inline-block'>
    <Button {...props} onClick={onClickAttachedImageButton}>이미지 업로드</Button>
    <input style={{ display: 'none', }} ref={inputRef} type='file' accept='image/*' onChange={onChangeInput}/>
    <ImageInputAlert isOpen={isImageInputAlertOpen} onClose={onCloseImageInputAlert} maxImageSize={maxImageSize}/>
  </Box>;
};

export default ImageInput;

type ImageInputAlertProp = {
  isOpen?: boolean,
  maxImageSize: number,
  onClose?: () => void,
};

const ImageInputAlert = ({
  isOpen = false,
  maxImageSize,
  onClose = () => {},
}: ImageInputAlertProp) => {

  const cancelRef = useRef(null);

  return <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader>저런!</AlertDialogHeader>
        <AlertDialogBody>
          <Text>이미지 크기가 최대 제한을 초과 하였습니다.</Text>
          <Text>최대 파일 크기: {formatBytes(maxImageSize)}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>확인</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>;
};

const formatBytes = (bytes: number, decimal = 0) => {
  const k = 1024.0;
  const dim = decimal > 0 ? decimal : 0;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unit = k ** i;
  const value = Number.parseInt((bytes / unit).toFixed(dim));
  return `${new Intl.NumberFormat().format(value)}${sizes[i]}`;
};
