import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const AddNotePage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation($note: addNoteInput!) {
              addNote(note: $note) {
                message
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
            note: { title, body },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data && result.data.addNote) {
        // Navigate back to the notes list after successful addition
        navigate("/");
      } else {
        throw new Error("Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError(error.message);
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth="600px" p={4}>
        <Button as={Link} to="/" mb={4} fontSize={"lg"}>
          Back
        </Button>
        <Heading as="h1" mb={4}>
          Add New Note
        </Heading>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={4}
            _hover={{ borderColor: "gray.600" }}
          />
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            mb={4}
            _hover={{ borderColor: "gray.600" }}
          />
          <Button
            type="submit"
            backgroundColor={"gray.600"}
            color="white"
            fontSize={"lg"}
            _hover={{ bg: "gray.700" }}
          >
            Add Note
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddNotePage;
