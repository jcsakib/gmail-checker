import { checkEmail } from '../smtpCheck.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const emails = req.body.emails;
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ error: "Email list required" });
  }

  const results = [];
  for (const email of emails.slice(0, 100)) {
    const result = await checkEmail(email);
    results.push({ email, result });
  }

  res.status(200).json({ results });
}
