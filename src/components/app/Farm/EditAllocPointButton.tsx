import { EditIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Checkbox,
  VStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { Formik, Form, Field, FormikErrors, FormikHelpers } from "formik";
import useMasterChefContract from "../../../hooks/useMasterChefContract";
import { EditAllocPointFormValues } from "../../../types";
import { parseBalanceToBigNumber } from "../../../utils";

interface EditAllocPointButtonProps {
  pid: number;
  currentAllocPoint: string;
}

const EditAllocPointButton = ({
  pid,
  currentAllocPoint,
}: EditAllocPointButtonProps) => {
  const initialValues: EditAllocPointFormValues = {
    allocPoint: currentAllocPoint,
    update: false,
  };

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const masterChefContract = useMasterChefContract();

  const handleEditAllocPoint = async (
    { allocPoint, update }: EditAllocPointFormValues,
    { resetForm }: FormikHelpers<EditAllocPointFormValues>
  ) => {
    if (!masterChefContract) return;

    try {
      let tx = await masterChefContract.set(pid, allocPoint, update, {
        gasLimit: 1000000,
      });
      await tx.wait();

      toast({
        title: "Edit AllocPoint",
        description: "Edited successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Edit AllocPoint",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    resetForm();
    onClose();
  };
  const validator = (values: EditAllocPointFormValues) => {
    const errors: FormikErrors<EditAllocPointFormValues> = {};

    if (values.allocPoint.length === 0) {
      errors.allocPoint = "Required";
    }

    const allocPointNumber = Number(values.allocPoint);
    if (isNaN(allocPointNumber) || allocPointNumber < 0) {
      errors.allocPoint = "Invalid number";
    }

    return errors;
  };

  return (
    <>
      <IconButton
        aria-label="edit alloc point"
        icon={<EditIcon />}
        onClick={onOpen}
      />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={initialValues}
          onSubmit={handleEditAllocPoint}
          validate={validator}
        >
          {({
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            isSubmitting,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <ModalContent>
                  <ModalHeader>Edit Alloc Point</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack gap={2} align="stretch">
                      <FormControl
                        isRequired
                        isInvalid={!!touched.allocPoint && !!errors.allocPoint}
                      >
                        <FormLabel>Alloc Point</FormLabel>
                        <NumberInput value={values.allocPoint}>
                          <Field
                            as={NumberInputField}
                            id="allocPoint"
                            name="allocPoint"
                          />
                        </NumberInput>
                        <FormHelperText>
                          Number of allocation points assigned to pool
                        </FormHelperText>
                        <FormErrorMessage>{errors.allocPoint}</FormErrorMessage>
                      </FormControl>

                      <Checkbox
                        isChecked={values.update}
                        onChange={() => {
                          setFieldValue("update", !values.update);
                        }}
                      >
                        Update reward variables for all pools
                      </Checkbox>
                    </VStack>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      isDisabled={
                        !isValid ||
                        Number(values.allocPoint) ===
                          Number(initialValues.allocPoint)
                      }
                      type="submit"
                    >
                      Edit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default EditAllocPointButton;
