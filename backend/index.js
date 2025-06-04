import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.46:3000', 'https://ta-ligado.vercel.app/', 'https://ta-ligado-caduzinhoks-projects.vercel.app/'],
  methods: ['POST'],
}));

app.use(express.json());


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.post('/api/gerar-explicacao', async (req, res) => {
    try {
        const { tema } = req.body;
        if (!tema) {
            return res.status(400).json({ error: 'Tema é obrigatório' });
        }

        const prompt = `
        Explique o tema "${tema}" para alunos do ensino médio, seguindo o formato JSON abaixo.

        {
          "explicacao": "Texto com a explicação clara sobre o tema.",
          "analogia": "Texto com uma analogia divertida sobre o tema.",
          "exemplo": "Texto com um exemplo prático e simples.",
          "quiz": [
            {
              "pergunta": "Pergunta sobre o tema.",
              "alternativas": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
              "resposta": 0 // índice da alternativa correta (0 = A, 1 = B, 2 = C, 3 = D)
            }
          ]
        }

        Importante:
        - Siga exatamente a estrutura acima.
        - Retorne apenas o JSON, sem explicações adicionais.
        - Use aspas duplas em todos os campos.
        - Mantenha a resposta concisa, com até 300 palavras no total.
        Comece agora:
        `;


        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        console.log(response.text);
        let textResponse = response.text.replaceAll("`", "").replace("json", "")
        const json = JSON.parse(textResponse);
        res.status(200).json(json);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// app.listen(process.env.PORT, () => {
//     console.log(`API rodando na porta ${process.env.PORT}`);
// });
export default app;