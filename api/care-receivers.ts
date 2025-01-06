import { CareReceiver } from "../types/care-receiver";

export const fetchCareReceivers = async (): Promise<CareReceiver[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-receivers`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
