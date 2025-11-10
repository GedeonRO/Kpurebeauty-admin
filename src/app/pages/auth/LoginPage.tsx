import { useState, FormEvent } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: '#F3F3F3' }}>
      <form
        className="flex flex-col min-w-[400px] max-w-[400px] border border-gray-100 bg-white rounded-xl shadow"
        style={{ gap: '20px', padding: '24px 20px' }}
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-2xl font-bold">K-Pure Admin</h1>
          <p className="text-[15px] text-gray-700">
            Entrez votre email et mot de passe pour accéder à votre compte
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded" style={{ padding: '12px' }}>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '4px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@kpure.com"
            className="w-full border border-gray-300 rounded focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
            style={{ height: '40px', padding: '0 12px' }}
            disabled={isLoading}
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '4px' }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full border border-gray-300 rounded focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
            style={{ height: '40px', padding: '0 12px' }}
            disabled={isLoading}
            required
          />
        </div>

        <button
          disabled={isLoading || !email || !password}
          type="submit"
          className="bg-[#14A800] w-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0f8500] transition-colors rounded flex items-center justify-center"
          style={{ padding: '8px 0' }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
}
