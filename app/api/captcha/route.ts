import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.gRecaptchaToken}`,
    })
      .then((reCaptchaRes) => reCaptchaRes.json())
      .then((reCaptchaRes) => {
        if (reCaptchaRes?.score > 0.5) {
          // Save data to the database from here
          return new Response("Success", {
            status: 200,
          });
        } else {
          return new Response("Failure", {
            status: 200,
          });
        }
      });
  } catch (err) {
    return new Response("Error verifying recaptcha", {
      status: 405,
    });
  }

  return Response.json({ success: true });
}
