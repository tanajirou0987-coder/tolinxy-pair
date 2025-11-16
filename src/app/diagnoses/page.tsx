import Link from "next/link";
import diagnosesMetadata from "../../../data/diagnoses-metadata.json";

interface DiagnosisMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  questions: number;
  duration: string;
  type: string;
  active: boolean;
  order: number;
  metadata: {
    icon: string;
    color: string;
    subtitle: string;
  };
}

export default function DiagnosesPage() {
  const diagnoses = (diagnosesMetadata.diagnoses as DiagnosisMetadata[])
    .filter((d) => d.active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <main className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#2C3E50] sm:text-5xl">
            🎵 診断を選ぶ
          </h1>
          <p className="text-lg text-[#2C3E50]/80">
            あなたに合った診断を選んでください
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {diagnoses.map((diagnosis) => (
            <Link
              key={diagnosis.id}
              href={diagnosis.path}
              className="group relative overflow-hidden rounded-lg border-2 border-[#2C3E50]/20 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4 text-5xl">{diagnosis.metadata.icon}</div>
              <h2 className="mb-2 text-2xl font-bold text-[#2C3E50]">
                {diagnosis.name}
              </h2>
              <p className="mb-2 text-sm font-medium text-[#2C3E50]/80">
                {diagnosis.metadata.subtitle}
              </p>
              <p className="mb-4 text-[#2C3E50]/70">{diagnosis.description}</p>
              <div className="flex items-center justify-between text-sm text-[#2C3E50]/60">
                <span>{diagnosis.questions}問</span>
                <span>{diagnosis.duration}</span>
              </div>
              <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-2"
                style={{
                  width: "100%",
                  background: diagnosis.metadata.color,
                }}
              />
            </Link>
          ))}
        </div>

        <div className="text-center space-y-2">
          <Link
            href="/"
            className="text-[#2C3E50]/60 hover:text-[#2C3E50] underline"
          >
            トップに戻る
          </Link>
          <div>
            <Link
              href="/dev"
              className="text-xs text-[#2C3E50]/40 hover:text-[#F39C12] underline"
            >
              🛠️ 開発者用ショートカット
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

