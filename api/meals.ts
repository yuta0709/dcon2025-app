import { Meal } from "../types/meal";

interface CreateMealRequest {
  careReceiverUuid: string;
  userUuid: string;
  mealType: string;
}

export const createMeal = async (data: CreateMealRequest): Promise<Meal> => {
  console.log(data);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface AddTranscriptRequest {
  transcript: string;
}

export const addTranscript = async (
  mealUuid: string,
  data: AddTranscriptRequest
): Promise<Meal> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meals/${mealUuid}/transcripts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
