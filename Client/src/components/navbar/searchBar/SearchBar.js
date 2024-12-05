import React, { useState } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { SearchIcon, ChatIcon } from "@chakra-ui/icons";
import axios from "axios";
import { postApi } from 'services/api'

export function SearchBar(props) {
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chatbot modal visibility
  const [messages, setMessages] = useState([]); // State for chat messages
  const [userInput, setUserInput] = useState(""); // User input for current question

  const { background, placeholder, borderRadius, ...rest } = props;

  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  // Handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const currentQuestion = userInput.trim();
    setUserInput(""); // Clear the input box

    // Append user's question to the chat immediately
    const userMessage = { question: currentQuestion, answer: null };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Prepare the API request payload
      const payload = { question: currentQuestion };

      // Make API call to fetch the bot's response
      const response = await postApi("api/chat/chatbot", payload);

      // Extract the bot's answer from the response
      const botAnswer = response.data.answer || "No response received.";

      // Update the last message with the bot's response
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].answer = botAnswer;
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
      const errorResponse = {
        question: null,
        answer: "An error occurred while getting a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  // Handle closing the chat modal
  const handleCloseChat = () => {
    setMessages([]); // Clear messages
    setIsChatOpen(false); // Close the modal
  };

  return (
    <Flex align="center" justify="space-between" w="100%" {...rest}>
      {/* Search Bar */}
      <InputGroup w={{ base: "100%", md: "200px" }}>
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            ></IconButton>
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          bg={background ? background : inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius ? borderRadius : "30px"}
          placeholder={placeholder ? placeholder : "Search..."}
        />
      </InputGroup>

      {/* Chatbot Button */}
      <IconButton
        aria-label="Chatbot"
        icon={<ChatIcon />}
        colorScheme="teal"
        ml="20px"
        onClick={() => setIsChatOpen(true)}
      />

      {/* Chatbot Modal */}
      <Modal isOpen={isChatOpen} onClose={handleCloseChat} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with Us</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={3}
              align="stretch"
              h="400px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p="4"
            >
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  {message.question && (
                    <HStack justify="flex-end">
                      <Box
                        bg="teal.500"
                        color="white"
                        px="4"
                        py="2"
                        borderRadius="md"
                        maxW="80%"
                      >
                        <Text>{message.question}</Text>
                      </Box>
                    </HStack>
                  )}
                  {message.answer && (
                    <HStack justify="flex-start">
                      <Box
                        bg="gray.200"
                        color="black"
                        px="4"
                        py="2"
                        borderRadius="md"
                        maxW="80%"
                      >
                        <Text>{message.answer}</Text>
                      </Box>
                    </HStack>
                  )}
                </React.Fragment>
              ))}
            </VStack>
            <Flex mt="4">
              <Input
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <Button ml="2" colorScheme="teal" onClick={handleSendMessage}>
                Send
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
