import { Meal } from "../types/meal";

interface CreateMealRequest {
  careReceiverUuid: string;
  userUuid: string;
  mealType: string;
}

export const createMeal = async (data: CreateMealRequest): Promise<Meal> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
