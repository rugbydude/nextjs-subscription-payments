import { generateUserStory } from '../../utils/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title } = req.body;
      const story = await generateUserStory(title);
      res.status(200).json({ story });
    } catch (error) {
      res.status(500).json({ error: 'Error generating user story' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
