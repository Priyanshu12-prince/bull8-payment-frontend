import { apiConfig } from "../config/baseUrlConfig";
import axios from "axios";

const BASE_URL=apiConfig.BASE_URL;

export async function validateUser(data: any, sig: any) {
  const shouldEncode = typeof data === 'string' && !/%[0-9A-Fa-f]{2}/.test(data);
  const payloadData = shouldEncode ? encodeURIComponent(data) : data;

  const response = await axios.post(
    `${BASE_URL}${apiConfig.VERSION}/url/decodeUrl`,
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

