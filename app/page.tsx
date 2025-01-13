"use client";
import "regenerator-runtime/runtime.js";
import { CareReceiver } from "@/types/care-receiver";
import { MealResponse } from "@/types/meal";
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
import { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Home = () => {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [currentMeal, setCurrentMeal] = useState<MealResponse | null>(null);

  const allSelected = selectedUserUuid;

  const previousMealRef = useRef<MealResponse | null>(null);
  const previousTranscriptRef = useRef("");

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserUuid(event.target.value);
  };

  const handleRecord = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "ja-JP" });
      // モックの初期データを設定
      const mockInitialMeal: MealResponse = {
        uuid: "mock-meal-uuid",
        careReceiver: null,
        mealType: null,
        mainDish: null,
        sideDish: null,
        soup: null,
        note: null,
      };
      setCurrentMeal(mockInitialMeal);
    }
  };

  useEffect(() => {
    // モックデータを設定
    const mockUsers: User[] = [
      { uuid: "user-1", name: "介護士A" },
      { uuid: "user-2", name: "介護士B" },
      { uuid: "user-3", name: "介護士C" },
    ];
    setUsers(mockUsers);
    setSelectedUserUuid(mockUsers[0].uuid); // デフォルトで最初の看護師を選択
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentMeal && transcript !== previousTranscriptRef.current) {
        console.log(transcript);
        // モックデータを更新
        const mockMeal: MealResponse = {
          uuid: "mock-meal-uuid",
          careReceiver: {
            uuid: "mock-uuid",
            name: "田中太郎",
          },
          mealType: "BREAKFAST" as const,
          mainDish: 8,
          sideDish: 7,
          soup: 10,
          note: "昨日はよく眠れなかった",
        };
        previousMealRef.current = mockMeal;
        setCurrentMeal(mockMeal);
        previousTranscriptRef.current = transcript;

        // 1秒後にハイライトをクリア
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentMeal, transcript]);

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        食事記録
      </Heading>

      <Box display="flex" gap={4} mb={8}>
        <Select value={selectedUserUuid} onChange={handleUserChange}>
          {users.map((user) => (
            <option key={user.uuid} value={user.uuid}>
              {user.name}
            </option>
          ))}
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
      <Button
        colorScheme="gray"
        mb={8}
        ml={4}
        onClick={resetTranscript}
        disabled={!listening}
      >
        文字起こしリセット
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>項目</Th>
            <Th>内容</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>記録対象者</Td>
            <Td>{currentMeal?.careReceiver?.name ?? "-"}</Td>
          </Tr>
          <Tr>
            <Td>食事の種類</Td>
            <Td>
              {currentMeal?.mealType === "BREAKFAST" && "朝食"}
              {currentMeal?.mealType === "LUNCH" && "昼食"}
              {currentMeal?.mealType === "DINNER" && "夕食"}
              {!currentMeal?.mealType && "-"}
            </Td>
          </Tr>
          <Tr>
            <Td>主食</Td>
            <Td>{currentMeal?.mainDish ?? "-"}/10</Td>
          </Tr>
          <Tr>
            <Td>副菜</Td>
            <Td>{currentMeal?.sideDish ?? "-"}/10</Td>
          </Tr>
          <Tr>
            <Td>汁物</Td>
            <Td>{currentMeal?.soup ?? "-"}/10</Td>
          </Tr>
        </Tbody>
      </Table>

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
