export function Header() {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">RentFax</h1>
        <nav>
          <a href="/" className="mr-4">Home</a>
          <a href="/blog">Blog</a>
        </nav>
      </div>
    </header>
  );
}