export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-green-800">Contact Us</h1>
      <p className="max-w-2xl text-lg text-gray-700 text-center mb-4">
        Have questions, feedback, or want to collaborate? Reach out to us!
      </p>
      <a href="mailto:info@skillora.com" className="text-blue-600 underline text-lg">info@skillora.com</a>
    </main>
  );
}
