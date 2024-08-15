import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const DeleteButton = ({ id }) => {
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation($id: ID!) {
              deleteNote(id: $id) {
                message
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

      if (
        result.data &&
        result.data.deleteNote &&
        result.data.deleteNote.message
      ) {
        toast({
          title: "Note deleted",
          description: result.data.deleteNote.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        console.error("Unexpected response structure:", result);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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

  return (
    <Button colorScheme="red" p="0" onClick={handleDelete}>
      <MdDeleteOutline size={25} />
    </Button>
  );
};

export default DeleteButton;
