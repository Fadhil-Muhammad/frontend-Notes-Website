import {
  Box,
  Flex,
  Heading,
  Text,
  WrapItem,
  Wrap,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                notes {
                  id
                  title
                  body
                  createdAt
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data && Array.isArray(result.data.notes)) {
          setNotes(result.data.notes);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        setError(error.message);
        setNotes([]);
      }
    };

    fetchNotes();
  }, []);

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      position="relative"
    >
      <Box width="100%" height="100%" p={0}>
        <Heading
          as="h1"
          mb={6}
          textAlign="center"
          maxWidth="100%"
          backgroundColor={"gray.600"}
          p={2}
          borderRadius={"sm"}
          color={"white"}
        >
          My Notes
        </Heading>
        {error ? (
          <Text color="red.500">{error}</Text>
        ) : notes.length > 0 ? (
          <Wrap spacing={6} justify={"center"} pl={4}>
            {notes.map((note) => (
              <WrapItem key={note.id} flexBasis="calc(50%-12px)">
                <Link to={`/note/${note.id}`} style={{ width: "100%" }}>
                  <Box
                    borderWidth={1}
                    backgroundColor="gray.100"
                    borderRadius="lg"
                    p={4}
                    height={"150px"}
                    _hover={{ bg: "gray.100" }}
                  >
                    <Heading as="h3" size="lg" p={2}>
                      {note.title}
                    </Heading>
                    <br></br>
                    <Text>{note.body.substring(0, 30)}</Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mt={2}
                      textAlign={"end"}
                    >
                      Date Created: {new Date(note.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                </Link>
              </WrapItem>
            ))}
          </Wrap>
        ) : (
          <Text
            textAlign="center"
            fontWeight="bold"
            as="h1"
            fontSize={"3xl"}
            color={"gray.400"}
            mt={20}
          >
            No notes available 😔
          </Text>
        )}
      </Box>
      <Button
        position="fixed"
        bottom="10"
        right="10"
        backgroundColor={"gray.400"}
        size="lg"
        borderRadius="xl"
        zIndex="overlay"
        as={Link}
        to="/addNote"
        _hover={{ bg: "gray.500" }}
      >
        Add Note ✙
      </Button>
    </Flex>
  );
};

export default IndexPage;
