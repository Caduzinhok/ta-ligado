import { Quiz } from "@/interfaces/quiz";
import { Resultado } from "@/interfaces/resultado";
import { useState } from "react";

interface QuizCardProps {
    quizIndex: number
    q: Quiz
    resultado: Resultado
}

export default function QuizCard({ quizIndex, q, resultado }: QuizCardProps) {
    const [respondido, setRespondido] = useState<boolean[]>(Array(resultado?.quiz.length).fill(false));
    const [respostas, setRespostas] = useState<number[]>(Array(resultado?.quiz.length).fill(-1));

    const validarResposta = (quizIndex: number) => {
        const novos = [...respondido];
        novos[quizIndex] = true;
        setRespondido(novos);
    };
    
    const selecionarAlternativa = (quizIndex: number, alternativaIndex: number) => {
        const novas = [...respostas];
        novas[quizIndex] = alternativaIndex;
        setRespostas(novas);
    };

    return (
        <div key={quizIndex} className="mb-6 border p-4 rounded-xl shadow-sm">
            <p className="font-semibold mb-2">{q.pergunta}</p>

            <div className="flex flex-col gap-2">
                {q.alternativas.map((alt, altIndex) => {
                    const selecionada = respostas[quizIndex] === altIndex;
                    const certa = q.resposta === altIndex;
                    const foiRespondido = respondido[quizIndex];

                    let bg = "bg-gray-100";
                    if (foiRespondido) {
                        if (selecionada && certa) bg = "bg-green-200";
                        else if (selecionada && !certa) bg = "bg-red-200";
                        else if (certa) bg = "bg-green-100";
                    } else if (selecionada) {
                        bg = "bg-blue-200";
                    }

                    return (
                        <button
                            key={altIndex}
                            onClick={() => selecionarAlternativa(quizIndex, altIndex)}
                            className={`${bg} text-left px-4 py-2 rounded-md border hover:brightness-95`}
                            disabled={foiRespondido}
                        >
                            <span className="font-bold">{String.fromCharCode(65 + altIndex)}.</span> {alt}
                        </button>
                    );
                })}
            </div>

            {!respondido[quizIndex] && (
                <button
                    onClick={() => validarResposta(quizIndex)}
                    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={respostas[quizIndex] === -1}
                >
                    Responder
                </button>
            )}

            {respondido[quizIndex] && (
                <p className="mt-2 text-sm">
                    {respostas[quizIndex] === q.resposta
                        ? "✅ Resposta correta!"
                        : `❌ Resposta incorreta. A correta era ${String.fromCharCode(65 + q.resposta)}.`}
                </p>
            )}
        </div>
    )
}