export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="size-11 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">K</span>
      </div>
      <h1 className="text-xl font-semibold text-[#034C53] relative inline-block">
        <span>K-Pure Admin</span>
        <svg
          className="absolute bottom-1 left-0 w-full"
          height="3"
          width="100%"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <path
            d="M0,2 Q25,3 50,2 T100,2"
            stroke="#14A800"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </h1>
    </div>
  );
}
