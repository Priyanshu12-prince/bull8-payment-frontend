import { BASE_URL } from "../config";
import axios from "axios";

export async function validateUser(data: any, sig: any) {
  const shouldEncode = typeof data === 'string' && !/%[0-9A-Fa-f]{2}/.test(data);
  const payloadData = shouldEncode ? encodeURIComponent(data) : data;

  const response = await axios.post(
    `${BASE_URL}/url/decodeUrl`,
    { data: payloadData, sig },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

   console.log(payloadData, "from payloadData");
  console.log(response.data, "from response");
  return response.data;
}

