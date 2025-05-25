export default function BlogToolbar({ mode, setMode }) {
  return (
    <div className="flex justify-between mb-6">
      <div className="flex gap-4">
        <button onClick={() => setMode("write")} className={`${mode === "write" && "font-bold underline"}`}>Write</button>
        <button onClick={() => setMode("preview")} className={`${mode === "preview" && "font-bold underline"}`}>Preview</button>
      </div>
      <button className="bg-blue-600 text-white px-5 py-2 rounded">Publish</button>
    </div>
  );
}
