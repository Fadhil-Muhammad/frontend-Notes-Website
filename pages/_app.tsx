import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./index";
import NotePage from "./notePage";
import AddNotePage from "./AddNotePage";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/note/:id" element={<NotePage />} />
          <Route path="/addNote" element={<AddNotePage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
