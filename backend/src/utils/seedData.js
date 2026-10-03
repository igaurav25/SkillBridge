const bcrypt = require('bcryptjs');

const getHashedPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
};

const getSeedData = async () => {
  const commonPassword = await getHashedPassword('Password123!');

  const users = [
    {
      name: 'Gaurav Sharma',
      email: 'student@skillbridge.com',
      password: commonPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      headline: 'Aspiring Full Stack Engineer | Angular & Node.js Enthusiast',
      isVerified: true,
      status: 'active',
    },
    {
      name: 'Priya Patel',
      email: 'priya@skillbridge.com',
      password: commonPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      headline: 'Frontend Engineer & UI Architect',
      isVerified: true,
      status: 'active',
    },
    {
      name: 'Marcus Vance',
      email: 'recruiter@skillbridge.com',
      password: commonPassword,
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      headline: 'Head of Technical Talent @ Nexus AI Labs',
      companyName: 'Nexus AI Labs',
      isVerified: true,
      status: 'active',
    },
    {
      name: 'Elena Rostova',
      email: 'recruiter2@skillbridge.com',
      password: commonPassword,
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      headline: 'Senior Talent Partner @ CloudScale Systems',
      companyName: 'CloudScale Systems',
      isVerified: true,
      status: 'active',
    },
    {
      name: 'Admin Supervisor',
      email: 'admin@skillbridge.com',
      password: commonPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      headline: 'SkillBridge System Administrator',
      isVerified: true,
      status: 'active',
    },
  ];

  const companies = [
    {
      name: 'Nexus AI Labs',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
      description: 'Building next-generation generative AI infrastructure, multi-agent frameworks, and enterprise intelligence tooling.',
      website: 'https://nexusailabs.example.com',
      industry: 'Artificial Intelligence',
      location: 'San Francisco, CA (Remote Friendly)',
      companySize: '51-200',
      isVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: 'CloudScale Systems',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100',
      description: 'Enterprise cloud infrastructure, Kubernetes orchestration, and automated microservice reliability platforms.',
      website: 'https://cloudscale.example.com',
      industry: 'Cloud Computing & DevOps',
      location: 'Seattle, WA',
      companySize: '201-500',
      isVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: 'FinFlow Technologies',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100',
      description: 'High-throughput payment gateway and algorithmic financial services serving millions of global transactions daily.',
      website: 'https://finflow.example.com',
      industry: 'Financial Technology',
      location: 'New York, NY',
      companySize: '500-1000',
      isVerified: true,
      verifiedAt: new Date(),
    },
    {
      name: 'PixelCraft Studios',
      logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100',
      description: 'Boutique design agency engineering high-end SaaS applications, design systems, and responsive web experiences.',
      website: 'https://pixelcraft.example.com',
      industry: 'Digital Design & Web',
      location: 'Austin, TX',
      companySize: '11-50',
      isVerified: true,
      verifiedAt: new Date(),
    },
  ];

  const interviewQuestions = [
    {
      category: 'JavaScript',
      topic: 'Event Loop & Concurrency',
      question: 'Explain the JavaScript Event Loop, Call Stack, Microtask Queue, and Macrotask Queue.',
      answer: 'JavaScript is single-threaded. The Call Stack executes synchronous code. Asynchronous callbacks are handled via queues: Microtasks (Promises, queueMicrotask, MutationObserver) run immediately after the current script executes and before the Macrotask queue (setTimeout, setInterval, I/O). The Event Loop continuously checks if the stack is clear and drains microtasks before picking the next macrotask.',
      explanation: 'Microtasks have higher priority than macrotasks. Promise.resolve().then() executes before setTimeout(fn, 0).',
      codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2`,
      difficulty: 'Intermediate',
      tags: ['Event Loop', 'Promises', 'Asynchronous', 'Concurrency'],
    },
    {
      category: 'Angular',
      topic: 'Change Detection & Signals',
      question: 'What are Angular Signals and how do they improve Change Detection over Zone.js?',
      answer: 'Angular Signals provide fine-grained reactivity. Instead of Zone.js monkey-patching async browser APIs and re-checking the entire component tree from top to bottom (Dirty Checking), Signals track dependencies directly. When a Signal value updates, only the specific template nodes or computed values depending on that signal are re-rendered, paving the way for zoneless, hyper-efficient Angular applications.',
      explanation: 'Introduced in Angular 16+ and solidified in modern Angular, signals (signal, computed, effect) eliminate unnecessary DOM reconciliations.',
      codeSnippet: `import { signal, computed } from '@angular/core';\n\nconst count = signal(0);\nconst double = computed(() => count() * 2);\n\ncount.update(c => c + 1);\nconsole.log(double()); // 2`,
      difficulty: 'Advanced',
      tags: ['Signals', 'Reactivity', 'Performance', 'Zoneless'],
    },
    {
      category: 'Node.js',
      topic: 'Streams & Buffers',
      question: 'What are Node.js Streams and why should you use them instead of fs.readFile for large files?',
      answer: 'Streams are collections of data that might not be available all at once and do not have to fit in memory. fs.readFile loads the entire file into V8 RAM before returning it, which will crash your process (OutOfMemory) for multi-gigabyte files. Streams (Readable, Writable, Duplex, Transform) process chunks sequentially, keeping memory footprints small and constant.',
      explanation: 'Pipe streams using pipeline() from stream/promises to safely handle backpressure and error teardowns.',
      codeSnippet: `const { pipeline } = require('stream/promises');\nconst fs = require('fs');\n\nawait pipeline(\n  fs.createReadStream('huge.log'),\n  zlib.createGzip(),\n  fs.createWriteStream('huge.log.gz')\n);`,
      difficulty: 'Intermediate',
      tags: ['Streams', 'Memory', 'I/O', 'Performance'],
    },
    {
      category: 'MongoDB',
      topic: 'Indexing & Aggregation',
      question: 'What is an Index Prefix in MongoDB compound indexes, and how does ESR (Equality, Sort, Range) rule work?',
      answer: 'A compound index on { a: 1, b: 1, c: 1 } supports queries on { a }, { a, b }, and { a, b, c }, but NOT { b } or { c } alone because MongoDB indexes utilize B-Trees. The ESR rule states that when designing compound indexes for queries with equality, sorting, and ranges, fields should be ordered: 1) Equality matches, 2) Sort fields, and 3) Range filters.',
      explanation: 'Following ESR allows MongoDB to find the matching documents in sorted order without needing an in-memory sort stage.',
      codeSnippet: `// Query: { status: 'active', age: { $gte: 21 } }, sort: { createdAt: -1 }\n// Optimal index: { status: 1, createdAt: -1, age: 1 }`,
      difficulty: 'Advanced',
      tags: ['Database', 'Indexes', 'ESR Rule', 'Performance'],
    },
    {
      category: 'DSA',
      topic: 'Dynamic Programming',
      question: 'Explain the difference between Top-Down (Memoization) and Bottom-Up (Tabulation) approaches in Dynamic Programming.',
      answer: 'Top-Down DP starts with the original problem and solves subproblems recursively, caching results in a hash table or array (memoization) to avoid redundant computations. Bottom-Up DP starts by solving the base cases first and iteratively builds up solutions to larger subproblems using loops and a table (tabulation), eliminating call stack overhead.',
      explanation: 'Tabulation avoids recursion stack overflow limits, while memoization only computes subproblems that are strictly required.',
      codeSnippet: `// Bottom-Up Fibonacci O(n) time, O(1) space\nfunction fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}`,
      difficulty: 'Intermediate',
      tags: ['Algorithms', 'DP', 'Recursion', 'Time Complexity'],
    },
    {
      category: 'OOP',
      topic: 'SOLID Principles',
      question: 'Explain the Single Responsibility Principle (SRP) and Open/Closed Principle (OCP) with clean code examples.',
      answer: 'SRP states that a class should have only one reason to change, meaning it should encapsulate a single responsibility or business concern. OCP states that software entities (classes, modules, functions) should be open for extension, but closed for modification—meaning new features should be added by implementing new interfaces/subclasses rather than editing tested legacy code.',
      explanation: 'Violating OCP leads to fragile code where adding a feature risks breaking unrelated existing logic.',
      codeSnippet: `// OCP example via Polymorphism\ninterface PaymentProcessor {\n  pay(amount: number): Promise<void>;\n}\nclass StripeProcessor implements PaymentProcessor {\n  async pay(amount: number) { /* Stripe logic */ }\n}\nclass PayPalProcessor implements PaymentProcessor {\n  async pay(amount: number) { /* PayPal logic */ }\n}`,
      difficulty: 'Beginner',
      tags: ['Design Patterns', 'Architecture', 'Clean Code', 'SOLID'],
    },
    {
      category: 'HR',
      topic: 'Behavioral & STAR Method',
      question: 'How do you answer "Tell me about a time you faced a critical production bug" using the STAR method?',
      answer: 'Situation: During a Black Friday flash sale, our checkout API experienced sudden 504 timeouts. Task: As lead backend engineer, my goal was to restore checkout availability within 15 minutes. Action: I examined Datadog telemetry, pinpointed an unindexed query exhausting database connections, applied a quick temporary query timeout and hotfixed the missing compound index on production with zero downtime. Result: Response times dropped from 8 seconds to 120ms, and transactions resumed seamlessly with 99.98% reliability.',
      explanation: 'STAR: Situation, Task, Action, Result. Always focus on YOUR individual contribution and quantify the outcome.',
      codeSnippet: '',
      difficulty: 'Beginner',
      tags: ['Behavioral', 'STAR Method', 'Leadership', 'Crisis Management'],
    },
  ];

  const skillCategories = [
    {
      name: 'Full Stack Development',
      slug: 'full-stack-developer',
      description: 'Modern end-to-end web software engineering across frontend, backend APIs, databases, and containerized deployment.',
      popularRoles: ['Full Stack Developer', 'MERN / MEAN Stack Engineer', 'Software Engineer'],
      targetSkills: [
        { name: 'JavaScript', importance: 'Essential', description: 'Core language of web applications' },
        { name: 'TypeScript', importance: 'Essential', description: 'Static typing for maintainable code' },
        { name: 'Angular', importance: 'Essential', description: 'Enterprise frontend framework' },
        { name: 'Node.js', importance: 'Essential', description: 'Server-side runtime' },
        { name: 'Express.js', importance: 'Essential', description: 'REST API framework' },
        { name: 'MongoDB', importance: 'Essential', description: 'NoSQL document database' },
        { name: 'Docker', importance: 'Recommended', description: 'Application containerization' },
        { name: 'AWS', importance: 'Recommended', description: 'Cloud hosting & storage' },
        { name: 'Redis', importance: 'NiceToHave', description: 'In-memory caching and session store' },
      ],
      targetRoles: [
        {
          title: 'Full Stack Developer',
          level: 'Entry to Mid',
          requiredSkills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Express.js', 'MongoDB'],
          recommendedSkills: ['Docker', 'Git', 'REST API', 'Unit Testing'],
          roadmap: [
            { step: 1, title: 'Language Foundations', description: 'Master ES6+ JavaScript, TypeScript types, interfaces, and async programming.', skills: ['JavaScript', 'TypeScript'] },
            { step: 2, title: 'Frontend Architecture', description: 'Build component hierarchies, reactive forms, routing guards, and state management in Angular.', skills: ['Angular', 'CSS3', 'RxJS'] },
            { step: 3, title: 'Backend & REST APIs', description: 'Design secure Express routes, JWT auth, middleware, and schema validation.', skills: ['Node.js', 'Express.js'] },
            { step: 4, title: 'Database & Data Modeling', description: 'Schema relationships, indexing, aggregation pipelines, and transaction safety in MongoDB.', skills: ['MongoDB', 'Mongoose'] },
            { step: 5, title: 'DevOps & Deployment', description: 'Containerize with Docker, configure CI/CD, and deploy on modern cloud infrastructure.', skills: ['Docker', 'Git', 'CI/CD'] },
          ],
        },
      ],
    },
    {
      name: 'Frontend Engineering',
      slug: 'frontend-developer',
      description: 'User interface architecture, design systems, web performance, accessibility, and modern reactive frameworks.',
      popularRoles: ['Frontend Developer', 'UI Engineer', 'Angular Developer'],
      targetSkills: [
        { name: 'HTML5', importance: 'Essential', description: 'Semantic structure' },
        { name: 'CSS3', importance: 'Essential', description: 'Modern layout, animations, responsive design' },
        { name: 'JavaScript', importance: 'Essential', description: 'DOM manipulation and ESNext' },
        { name: 'TypeScript', importance: 'Essential', description: 'Type-safe frontend code' },
        { name: 'Angular', importance: 'Essential', description: 'Component-driven framework' },
        { name: 'RxJS', importance: 'Recommended', description: 'Reactive state & event streams' },
        { name: 'Jest', importance: 'Recommended', description: 'Component unit testing' },
      ],
      targetRoles: [
        {
          title: 'Frontend Developer',
          level: 'Entry to Mid',
          requiredSkills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Angular'],
          recommendedSkills: ['RxJS', 'Web Performance', 'Accessibility (a11y)'],
          roadmap: [
            { step: 1, title: 'Design & Semantics', description: 'Master semantic HTML, CSS Grid/Flexbox, CSS variables, and dark mode theming.', skills: ['HTML5', 'CSS3'] },
            { step: 2, title: 'TypeScript & Reactive Coding', description: 'Deep dive into TypeScript strict typing and RxJS observables.', skills: ['TypeScript', 'RxJS'] },
            { step: 3, title: 'Angular Deep Dive', description: 'Master Signals, standalone components, dependency injection, and HTTP interceptors.', skills: ['Angular'] },
          ],
        },
      ],
    },
  ];

  return {
    users,
    companies,
    interviewQuestions,
    skillCategories,
  };
};

module.exports = { getSeedData };
