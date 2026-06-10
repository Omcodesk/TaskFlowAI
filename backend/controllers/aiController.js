import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined;
const aiModel = process.env.GROQ_API_KEY ? "llama3-8b-8192" : "gpt-3.5-turbo";

const openai = apiKey ? new OpenAI({ apiKey, baseURL }) : null;

// @desc    Breakdown a simple task title into a detailed description and metadata
// @route   POST /api/ai/breakdown
// @access  Private
export const breakdownTask = async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required for AI breakdown' });
        }

        // Mock AI response if no API key is provided
        if (!openai) {
            console.log('No OPENAI_API_KEY found, using mock AI response.');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            return res.json({
                description: `✨ **AI Generated Plan for: ${title}**\n\n1. Initial research and requirements gathering.\n2. Draft the core implementation.\n3. Review and iterate based on feedback.\n4. Final testing and deployment.\n\n*Note: Add your OpenAI API key to .env to get real AI breakdowns!*`,
                priority: 'High',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days from now
            });
        }

        const prompt = `You are an expert Project Manager. Break down the following task title into a professional, actionable step-by-step plan. 
        Use GitHub-flavored markdown checklists (- [ ]) for the steps so they can be easily tracked. 
        Also suggest an appropriate priority (strictly choose ONE of: Low, Medium, High, Critical) and a reasonable number of days to complete it.
        
        Task Title: "${title}"
        
        Respond ONLY in the following JSON format:
        {
            "description": "...",
            "priority": "High",
            "daysToComplete": 3
        }`;

        const response = await openai.chat.completions.create({
            model: aiModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const aiData = JSON.parse(response.choices[0].message.content);
        
        // Calculate due date based on daysToComplete
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (aiData.daysToComplete || 3));

        res.json({
            description: aiData.description,
            priority: aiData.priority,
            dueDate: dueDate.toISOString().split('T')[0]
        });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'Failed to generate AI breakdown' });
    }
};

// @desc    Summarize a long task description
// @route   POST /api/ai/summarize
// @access  Private
export const summarizeTask = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Text is required for summarization' });
        }

        if (!openai) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.json({
                summary: "✨ **AI Summary:**\n- Simulated bullet point 1\n- Simulated bullet point 2\n- Provide an API key for real summaries."
            });
        }

        const response = await openai.chat.completions.create({
            model: aiModel,
            messages: [{ role: 'user', content: `Summarize the following task description into 3 short, actionable bullet points:\n\n${text}` }],
            temperature: 0.5,
        });

        res.json({ summary: response.choices[0].message.content });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'Failed to generate summary' });
    }
};

// @desc    Suggest Priority for a task
// @route   POST /api/ai/suggest-priority
// @access  Private
export const suggestPriority = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        if (!openai) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return res.json({ priority: 'High' });
        }

        const prompt = `Based on the following task, suggest a priority.
        You MUST respond strictly with exactly ONE of the following words: Low, Medium, High, Critical.
        Do not add any other text.
        Title: ${title}
        Description: ${description || 'N/A'}`;
        const response = await openai.chat.completions.create({
            model: aiModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        });

        const suggested = response.choices[0].message.content.trim();
        res.json({ priority: ['Low', 'Medium', 'High', 'Critical'].includes(suggested) ? suggested : 'Medium' });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'Failed to suggest priority' });
    }
};

// @desc    Improve task description
// @route   POST /api/ai/improve-description
// @access  Private
export const improveDescription = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Description text is required' });

        if (!openai) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.json({ improved: `✨ **Improved Description:**\n\n${text}\n\n*Added more context and formatted professionally. (Simulated)*` });
        }

        const prompt = `Rewrite and improve the following task description to make it professional, clear, and actionable. Add bullet points if it helps readability:\n\n${text}`;
        const response = await openai.chat.completions.create({
            model: aiModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.6,
        });

        res.json({ improved: response.choices[0].message.content });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'Failed to improve description' });
    }
};
