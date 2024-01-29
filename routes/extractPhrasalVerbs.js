const express = require('express');
const router = express.Router();


// Route to extract phrasal verbs
router.post('/api/extract_phrasal_verbs', (req, res) => {
  //const sentence = req.body.sentence;

  let sentence = `I wake up too early every day. I am just trying to get off something  of my chest.`;

  if (!sentence) {
    return res.status(400).json({ error: 'Missing sentence in the request body' });
  }

  // Perform phrasal verb extraction (using a simple regex in this example)
  const phrasalVerbs = extractPhrasalVerbs(sentence);

  res.json({ phrasalVerbs });
});

// Function to extract phrasal verbs using a simple regex (you might need a more advanced approach)
function extractPhrasalVerbs(sentence) {
  // A simple regex to match common phrasal verbs
  const phrasalVerbRegex = /\b(?:\w+\s(?:up|down|in|out|on|off|over|up\w+))\b/gi;
  return sentence.match(phrasalVerbRegex) || [];
}


module.exports = router;