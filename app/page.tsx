"use client";
import { fetchCareReceivers } from "@/api/care-receivers";
import { fetchUsers } from "@/api/users";
import { CareReceiver } from "@/types/care-receiver";
import { User } from "@/types/user";
import {
  Box,
  Button,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

const Home = () => {
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [careReceivers, setCareReceivers] = useState<CareReceiver[]>([]);
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [selectedCareReceiverUuid, setSelectedCareReceiverUuid] =
    useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  const allSelected =
    selectedUserUuid && selectedCareReceiverUuid && selectedMealType;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const loadCareReceivers = async () => {
      try {
        const fetchedCareReceivers = await fetchCareReceivers();
        setCareReceivers(fetchedCareReceivers);
      } catch (error) {
        console.error("Failed to fetch care receivers:", error);
      }
    };

    loadUsers();
    loadCareReceivers();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "ja-JP";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setTranscripts((prev) => [...prev, transcript]);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const handleRecord = () => {
    if (!isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserUuid(event.target.value);
  };

  const handleCareReceiverChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCareReceiverUuid(event.target.value);
  };

  const handleMealTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMealType(event.target.value);
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        食事記録
      </Heading>

      <Box display="flex" gap={4} mb={8}>
        <Select
          placeholder="介護士を選択"
          value={selectedUserUuid}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.uuid} value={user.uuid}>
              {user.name}
            </option>
          ))}
        </Select>
        <Select
          placeholder="被介護者を選択"
          value={selectedCareReceiverUuid}
          onChange={handleCareReceiverChange}
        >
          {careReceivers.map((careReceiver) => (
            <option key={careReceiver.uuid} value={careReceiver.uuid}>
              {careReceiver.name}
            </option>
          ))}
        </Select>

        <Select
          placeholder="食事の種類を選択"
          value={selectedMealType}
          onChange={handleMealTypeChange}
        >
          <option value="BREAKFAST">朝食</option>
          <option value="LUNCH">昼食</option>
          <option value="DINNER">夕食</option>
        </Select>
      </Box>

      <Button
        colorScheme={isRecording ? "red" : "blue"}
        mb={8}
        onClick={handleRecord}
        disabled={!allSelected}
      >
        {isRecording ? "録音停止" : "録音開始"}
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>項目</Th>
            <Th>割合</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>主食</Td>
            <Td>8/10</Td>
          </Tr>
          <Tr>
            <Td>副菜</Td>
            <Td>6/10</Td>
          </Tr>
          <Tr>
            <Td>汁物</Td>
            <Td>10/10</Td>
          </Tr>
        </Tbody>
      </Table>

      <Textarea placeholder="特記事項" mt={4} />
      <Box mt={4} mb={4} borderWidth="1px" borderRadius="lg" p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          文字起こし履歴
        </Text>
        {transcripts.map((transcript, index) => (
          <Text key={index} mb={2}>
            {index + 1}. {transcript}
          </Text>
        ))}
        {transcripts.length === 0 && (
          <Text color="gray.500">履歴はありません</Text>
        )}
      </Box>
    </Box>
  );
};

export default Home;
