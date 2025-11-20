import List from "@/components/list";

export default function Home() {
  const listItems = [
    {
      parent: "Building",
      children: [
        { text: "Registercheck", symbol: "dot" as const, weight: 500, domain: "registercheck.de" },
        { text: "AttentionFactory", domain: "xplosiv.ai" },
        { text: "Bowie.video", domain: "bowie.video" },
        "Google",
        { text: "Trustyourvc", domain: "trustyourvc.com" },
      ],
    },
    {
      parent: "Reading",
      children: [
        "Albert Camus",
        { text: "Agnes Callard", symbol: "dot" as const },
        "David Deutsch",
        "Deirdre Nansen McCloskey",
        "Denis Johnson",
        { text: "Frederick Taylor", symbol: "star" as const },
        "Irving Kristol",
        "Max Weber / Andrea Maurer",
        "Max Weber",
        "Milton Friedman",
        "Rob Henderson",
        "Roger Eatwell",
        "Sebastian Mallaby",
        { text: "Thomas Piketty", symbol: "star" as const },
        "W. Somerset Maugham",
      ],
    },
    {
      parent: "Listening",
      children: [
        { text: "2hollis", symbol: "star" as const },
        "4evr",
        "Aphex Twin",
        { text: "Brian Eno", symbol: "star" as const },
        "Cro",
        "Future",
        "Hammock",
        "Kanye West",
        "Moby",
        "Richard Wagner",
        "Robert Miles",
        "Snap!",
        { text: "Snow Strippers", symbol: "star" as const },
        "Souly",
        "Ti:esto",
      ],
    },
    {
      parent: "Watching",
      children: [
        "Brothers",
        "Fight Club",
        { text: "Interstellar", symbol: "star" as const },
        "Kill Bill",
        "Prisoners",
        "Seven",
        { text: "Severance", symbol: "dot" as const },
        "Silence of the Lambs",
        "Silicon Valley",
        "Silie",
        { text: "Succession", symbol: "star" as const },
        "The Social Network",
        "The Zodiac Killer",
        { text: "True Detective Season 1", symbol: "star" as const },
      ],
    },
    { parent: "Writing" },
    { parent: "Using" },
    { parent: "Connecting" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black pt-[50px]">
      {/* Left Column */}
      <div className="flex w-1/2 items-start justify-center">
        <div className="flex flex-col items-start">
          <div 
            className="mb-4 border-t border-black dark:border-white"
            style={{ width: '100%' }}
          ></div>
          <h1 
            className="text-black dark:text-white whitespace-nowrap"
            style={{ 
              fontFamily: 'var(--font-braun-linear)',
              fontWeight: 400,
              fontSize: '48px'
            }}
          >
            David Korn
          </h1>
          <div className="mt-[40px] flex flex-col gap-2">
            <a 
              href="mailto:me@davidkorn.de"
              className="text-black dark:text-white"
              style={{ 
                fontFamily: 'var(--font-braun-linear)',
                fontWeight: 400
              }}
            >
              me@davidkorn.de
            </a>
            <div className="flex gap-4">
              <a 
                href="https://x.com/dav1dk0rn"
                className="text-black dark:text-white"
                style={{ 
                  fontFamily: 'var(--font-braun-linear)',
                  fontWeight: 400
                }}
              >
                Twitter
              </a>
              <a 
                href="https://www.linkedin.com/in/korn-david/"
                className="text-black dark:text-white"
                style={{ 
                  fontFamily: 'var(--font-braun-linear)',
                  fontWeight: 400
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex w-1/2 items-start justify-center">
        <List items={listItems} />
      </div>
    </div>
  );
}
