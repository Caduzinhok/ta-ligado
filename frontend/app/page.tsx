'use client';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Resultado } from '@/interfaces/resultado';
import QuizCard from '@/components/quizCard';

export default function GeradorExplicacoes() {
  const [tema, setTema] = useState('');
  const [resultado, setResultado] = useState<Resultado | undefined>(undefined);
  const [loading, setLoading] = useState(false);


  async function gerarExplicacao() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3333/api/gerar-explicacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });

      if (!response.ok) throw new Error("Erro na resposta da API");

      const json = await response.json();

      // Aqui convertemos para o tipo Resultado
      const resultadoAPI = json as Resultado;

      // Validação simples (opcional)
      if (
        resultadoAPI.explicacao &&
        resultadoAPI.analogia &&
        resultadoAPI.exemplo &&
        Array.isArray(resultadoAPI.quiz)
      ) {

        setResultado(resultadoAPI)
      }
      setLoading(false);

    } catch (err) {
      console.error("Erro ao gerar explicação");
      setLoading(false);

    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">📚 Ta Ligado?</h1>
      <h2 className="text-lg font-semibold text-center">Entendeu nada? A gente explica! 💡</h2>
      <p className="text-center text-muted-foreground">Digite um tema e receba uma explicação simples com exemplos e quiz.</p>

      <Textarea
        placeholder="Ex: Revolução Francesa, Mitose, Função do 1º grau, Principio da Termodinâmica..."
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={gerarExplicacao} disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Explicação'}
      </Button>

      {resultado && (
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <h2 className="font-semibold">✅ Explicação:</h2>
              <p>{resultado.explicacao}</p>
            </div>
            <div>
              <h2 className="font-semibold">🎓 Analogia:</h2>
              <p>{resultado.analogia}</p>
            </div>
            <div>
              <h2 className="font-semibold">🧪 Exemplo:</h2>
              <p>{resultado.exemplo}</p>
            </div>
            <div>
              <h2 className="font-semibold">🧠 Quiz:</h2>
              {resultado.quiz.map((q, quizIndex) => (
                <QuizCard 
                  quizIndex={quizIndex}
                  q={q}
                  resultado={resultado}
                
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
