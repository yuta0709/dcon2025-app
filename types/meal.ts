import { CareReceiver } from "./care-receiver";

export type MealResponse = {
  uuid: string;
  careReceiver: CareReceiver | null;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | null;
  mainDish: number | null;
  sideDish: number | null;
  soup: number | null;
  note: string | null;
};
