import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  verifyLink: string;
};

export default function VerificationEmail({
  name,
  verifyLink,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Rayos Global Emporium account</Preview>

      <Body
        style={{
          backgroundColor: "#111827",
          fontFamily: "Arial, sans-serif",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#1f2937",
            borderRadius: "20px",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >
          <Section
            style={{
              backgroundColor: "#facc15",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                margin: 0,
                color: "#000",
                fontSize: "32px",
              }}
            >
              RAYOS
            </Heading>

            <Text
              style={{
                color: "#000",
                marginTop: "8px",
              }}
            >
              Global Emporium
            </Text>
          </Section>

          <Section style={{ padding: "40px" }}>
            <Heading
              style={{
                color: "#facc15",
                textAlign: "center",
              }}
            >
              Verify Your Email
            </Heading>

            <Text>Hello {name}, 👋</Text>

            <Text>
              Thank you for creating your Rayos Global Emporium account.
            </Text>

            <Text>
              Click the button below to verify your email and start shopping.
            </Text>

            <Section
              style={{
                textAlign: "center",
                margin: "40px 0",
              }}
            >
              <Button
                href={verifyLink}
                style={{
                  backgroundColor: "#facc15",
                  color: "#000",
                  padding: "16px 40px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                VERIFY EMAIL
              </Button>
            </Section>

            <Text>
              If you didn't create this account, simply ignore this email.
            </Text>

            <Text
              style={{
                marginTop: "40px",
                color: "#9ca3af",
              }}
            >
              Need help?
            </Text>

            <Text
              style={{
                color: "#9ca3af",
              }}
            >
              support@rayosglobal.com
            </Text>
          </Section>

          <Section
            style={{
              borderTop: "1px solid #374151",
              padding: "25px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "13px",
            }}
          >
            © 2026 Rayos Global Emporium.
            <br />
            All rights reserved.
          </Section>
        </Container>
      </Body>
    </Html>
  );
}