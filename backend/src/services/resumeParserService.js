const pdfParse = require('pdf-parse');

const extractTextFromBuffer = async (buffer, mimeType, originalName) => {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  // If plain text
  if (mimeType === 'text/plain' || originalName.toLowerCase().endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  // If PDF
  if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.warn('PDF parsing error, falling back to buffer string decode:', err.message);
      return buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
    }
  }

  // Fallback for doc/docx/other
  return buffer.toString('utf-8');
};

const commonSkillSet = [
  'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'Node.js', 'Express.js', 'Nest.js',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'Go', 'Rust',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Git', 'GitHub', 'CI/CD', 'GraphQL', 'REST API', 'Microservices', 'Linux', 'TailwindCSS',
  'HTML5', 'CSS3', 'Sass', 'Webpack', 'Jest', 'Mocha', 'Postman', 'Kafka', 'RabbitMQ',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms', 'System Design'
];

const detectSkillsFromText = (text) => {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const found = [];

  for (const skill of commonSkillSet) {
    const skillNorm = skill.toLowerCase();
    // Escape regex characters
    const escaped = skillNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i');
    if (regex.test(normalized)) {
      found.push(skill);
    }
  }

  return Array.from(new Set(found));
};

module.exports = {
  extractTextFromBuffer,
  detectSkillsFromText,
  commonSkillSet,
};
