import { Resend } from "resend";
import VerificationEmail from "../../../emails/VerificationEmail";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, verifyLink } = await req.json();

    const html = await render(
      VerificationEmail({
        name,
        verifyLink,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "Rayos Global Emporium <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Rayos Global Emporium account",
      html,
    });

    if (error) {
      return Response.json(error, { status: 400 });
    }

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}