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
  title: "トリンクシーのふたり診断 | 恋愛相性診断",
  description:
    "2人のリズムを数分で診断。トリンクシーのふたり診断は、恋愛タイプの測定と相性分析をかんたん＆ビジュアルに届ける診断アプリです。",
  openGraph: {
    title: "トリンクシーのふたり診断 | 恋愛相性診断",
    description:
      "18問/54問の質問に答えるだけで、2人の恋愛タイプと相性をカードレポートで体験できます。",
    url: "https://trinksee.example",
    siteName: "トリンクシーのふたり診断",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "トリンクシーのふたり診断" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "トリンクシーのふたり診断 | 恋愛相性診断",
    description:
      "好みも価値観も「音色」にすると分かりやすい。トリンクシーのふたり診断で2人のチューニングを可視化しよう。",
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
        <div className="relative min-h-screen w-full overflow-hidden text-foreground">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[#ff006e] opacity-15 blur-[200px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00f5ff] opacity-15 blur-[200px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8338ec] opacity-12 blur-[180px] animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          <main className="relative z-10 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
