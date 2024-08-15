import { Box, Flex, Text, Button, useToast } from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import DeleteButton from "./components/deleteHandler";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query($id: ID!) {
                note(id: $id) {
                  id
                  title
                  body
                  createdAt
                }
              }
            `,
            variables: { id },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data && result.data.note) {
          setNote(result.data.note);
        } else {
          throw new Error("Note not found");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        setError(error.message);
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const title = titleRef.current.innerText;
      const body = bodyRef.current.innerText;

      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation($edits: editNoteInput!, $id: ID!) {
              updateNote(edits: $edits, id: $id) {
                message,
                note {
                  id
                  title
                  body
                  createdAt
                }
              }
            }
          `,
          variables: {
            id,
            edits: {
              title,
              body,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (
        result.data &&
        result.data.updateNote &&
        result.data.updateNote.message
      ) {
        toast({
          title: "Note Updated",
          description: result.data.updateNote.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNote(result.data.updateNote.note);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) return <Text color="red.500">{error}</Text>;
  if (!note) return <Text>Loading...</Text>;

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth="60%" p={4} borderRadius="md" bg="white">
        <Button as={Link} to="/" mb={4}>
          <IoIosArrowBack />
        </Button>
        <Box
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          mb={4}
          fontSize="4xl"
          fontWeight="bold"
          borderColor="gray.200"
          pb={2}
          _focus={{ outline: "none" }}
        >
          {note.title}
        </Box>
        <Box
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          mb={4}
          minHeight="200px"
          whiteSpace="pre-wrap"
          _focus={{ outline: "none" }}
        >
          {note.body}
        </Box>
        <Text fontSize="md" color="gray.500" mb={4}>
          Created: {new Date(note.createdAt).toLocaleString()}
        </Text>
        <Button
          backgroundColor={"gray.600"}
          color="white"
          fontSize={"lg"}
          onClick={handleUpdate}
          mr={2}
          p={0}
          _hover={{ bg: "gray.700" }}
        >
          <FaRegSave size={25} />
        </Button>
        <DeleteButton id={id} />
      </Box>
    </Flex>
  );
};

export default NotePage;
