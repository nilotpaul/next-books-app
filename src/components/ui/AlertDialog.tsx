'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  useDisclosure,
} from '@nextui-org/modal';
import { cn } from '@/utils/utils';

type AlertDialogProps = {
  trigger: JSX.Element;
  headerContent: JSX.Element | string;
  bodyContent: JSX.Element | string;
  footerContent: JSX.Element | string;
} & Omit<ModalProps, 'children'>;

const AlertDialog = ({
  trigger,
  headerContent,
  bodyContent,
  footerContent,
  ...props
}: AlertDialogProps) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <div onClick={onOpen} className='h-fit w-fit'>
        {trigger}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
        <ModalContent className='min-w-[500px]'>
          <ModalHeader className='pb-0 text-lg'>{headerContent}</ModalHeader>

          <ModalBody>{bodyContent}</ModalBody>

          <ModalFooter>{footerContent}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlertDialog;
