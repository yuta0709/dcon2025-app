"use client";
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
  const recognitionRef = useRef<any>(null);

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

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        介護食事トラッカー
      </Heading>

      <Box display="flex" gap={4} mb={8}>
        <Select placeholder="介護士を選択">
          <option value="option1">オプション 1</option>
          <option value="option2">オプション 2</option>
          <option value="option3">オプション 3</option>
        </Select>
        <Select placeholder="入居者を選択">
          <option value="option1">オプション 1</option>
          <option value="option2">オプション 2</option>
          <option value="option3">オプション 3</option>
        </Select>
        <Select placeholder="食事の種類を選択">
          ,<option value="option1">オプション 1</option>
          <option value="option2">オプション 2</option>
          <option value="option3">オプション 3</option>
        </Select>
      </Box>

      <Button
        colorScheme={isRecording ? "red" : "blue"}
        mb={8}
        onClick={handleRecord}
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
