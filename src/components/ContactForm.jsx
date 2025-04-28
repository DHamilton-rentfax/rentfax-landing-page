// src/components/ContactForm.jsx
import { useForm, ValidationError } from '@formspree/react';

export const ContactForm = () => {
  const [state, handleSubmit] = useForm("mdkgkrwd"); // <-- Confirm this is your real Formspree ID

  if (state.succeeded) {
    return <p className="text-green-600 text-center">Thanks for joining!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <label htmlFor="email" className="font-medium">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        name="email"
        className="border p-2 rounded"
        required
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
        className="text-red-500"
      />

      <label htmlFor="message" className="font-medium">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        className="border p-2 rounded"
      />
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
        className="text-red-500"
      />

      <button
        type="submit"
        disabled={state.submitting}
        className="bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};
