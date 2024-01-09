import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define response data type
type Data = { message?: string; error?: string; };

// Email validation schema
const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" });

// Subscription handler function
const subscribeHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  // 1. Validate email address
  const emailValidation = EmailSchema.safeParse(req.body.email);
  if (!emailValidation.success) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  // 2. Retrieve Mailchimp credentials from environment variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const API_SERVER = process.env.MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  // 3. Construct Mailchimp API request URL
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  // 4. Prepare request data
  const data = {
    email_address: emailValidation.data,
    status: "subscribed",
  };

  // 5. Set request headers
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `api_key ${API_KEY}`,
    },
  };

  // 6. Send POST request to Mailchimp API
  try {
    const response = await axios.post(url, data, options);
    if (response.status == 200) {
      return res.status(201).json({ message: "Awesome! You have successfully subscribed!" });
    }
  } catch (error) {
    // TODO: add this recent updated part to the article 
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        `${error.response?.data.title}`,
        `${error.response?.data.detail}`
      );

      if (error.response?.data.title == "Member Exists") {
        return res.status(400).json({
          error: "Uh oh, it looks like this email's already subscribed🧐",
        });
      }
    }

    return res.status(500).json({
      error:
        "Oops! There was an error subscribing you to the newsletter. Please email me at ogbonnakell@gmail.com and I'll add you to the list.",
    });
  }
};

export default subscribeHandler;