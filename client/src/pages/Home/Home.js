import { Header } from "../../components";

export const Home = () => {
  return (
    <div className="bg-blue-100 h-screen">
      <Header />
      <main className="pt-32 text-center font-extrabold text-5xl">
        <h2 className="font-extrabold text-5xl">WELCOME</h2>
        <h2 className="mt-3">TO</h2>
        <h2 className="font-extrabold text-5xl mt-3 text-indigo-900">❤❤Quiz-Buddy ❤❤</h2>
      </main>
    </div>
  );
};
