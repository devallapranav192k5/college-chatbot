import "./globals.css";

export const metadata = {
  title: "Core AI Interface",
  description: "College Chatbot 2.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans selection:bg-neutral-800">
        {children}
      </body>
    </html>
  );
}