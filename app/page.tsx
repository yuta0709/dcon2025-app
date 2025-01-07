"use client";
import "regenerator-runtime/runtime.js";
import { fetchCareReceivers } from "@/api/care-receivers";
import { addTranscript, createMeal } from "@/api/meals";
import { fetchUsers } from "@/api/users";
import { CareReceiver } from "@/types/care-receiver";
import { Meal } from "@/types/meal";
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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Home = () => {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const [users, setUsers] = useState<User[]>([]);
  const [careReceivers, setCareReceivers] = useState<CareReceiver[]>([]);
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [selectedCareReceiverUuid, setSelectedCareReceiverUuid] =
    useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);

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

  const handleRecord = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "ja-JP" });
      const meal = await createMeal({
        careReceiverUuid: selectedCareReceiverUuid,
        userUuid: selectedUserUuid,
        mealType: selectedMealType,
      });
      setCurrentMeal(meal);
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

  useEffect(() => {
    (async () => {
      if (currentMeal) {
        const meal = await addTranscript(currentMeal.uuid, { transcript });
        setCurrentMeal(meal);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

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
        colorScheme={listening ? "red" : "blue"}
        mb={8}
        onClick={handleRecord}
        disabled={!allSelected}
      >
        {listening ? "録音停止" : "録音開始"}
      </Button>

      {currentMeal && (
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
              <Td>{currentMeal.mainDish ?? "-"}/10</Td>
            </Tr>
            <Tr>
              <Td>副菜</Td>
              <Td>{currentMeal.sideDish ?? "-"}/10</Td>
            </Tr>
            <Tr>
              <Td>汁物</Td>
              <Td>{currentMeal.soup ?? "-"}/10</Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
        <Text fontWeight="bold" mb={2}>
          特記事項
        </Text>
        <Text>{currentMeal?.note || "特記事項なし"}</Text>
      </Box>
      <Box mt={4} mb={4} borderWidth="1px" borderRadius="lg" p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          文字起こし
        </Text>
        <Text>{transcript}</Text>
      </Box>
    </Box>
  );
};

export default Home;
