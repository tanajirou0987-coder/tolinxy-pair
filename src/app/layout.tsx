import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Pairly Lab | 恋愛相性診断",
  description:
    "2人のリズムを数分で診断。Pairly Labは、恋愛タイプの測定と相性分析をかんたん＆ビジュアルに届ける診断アプリです。",
  openGraph: {
    title: "Pairly Lab | 恋愛相性診断",
    description:
      "18問/54問の質問に答えるだけで、2人の恋愛タイプと相性をカードレポートで体験できます。",
    url: "https://match-tune.example",
    siteName: "Pairly Lab",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pairly Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pairly Lab | 恋愛相性診断",
    description:
      "好みも価値観も「音色」にすると分かりやすい。Pairly Labで2人のチューニングを可視化しよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={lato.variable}>
      <body className={`${lato.className} antialiased`}>
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
            <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#ffd93b1a] blur-[140px]" />
            <div className="absolute left-0 top-0 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[#7ff6f220] blur-[160px]" />
            <div className="absolute bottom-0 right-0 h-[360px] w-[360px] translate-y-1/2 rounded-full bg-[#9a8cff26] blur-[180px]" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          </div>
          <main className="relative z-10 flex justify-center px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
