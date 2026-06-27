export const categories = ["All", "AI", "Development", "UI/UX", "Productivity", "Tutorials", "Design"];

export const mockBlogPosts = [
  {
    id: 'how-i-built-my-futuristic-portfolio',
    title: "How I Built My Futuristic Portfolio",
    category: "UI/UX",
    description: "A behind-the-scenes look at how I designed and developed my futuristic personal portfolio website.",
    content: `
# Behind the Scenes: Building a Futuristic Portfolio

Creating a portfolio that stands out in 2026 requires more than just clean code; it requires a cinematic experience. In this post, I'll dive deep into the design philosophy and technical stack used to build my personal brand.

## The Vision
The goal was "Minimal Luxury meets Cyberpunk". I wanted deep blacks, glassmorphism, and cyan accents that felt alive through motion.

## Technical Stack
- **Next.js 15**: For that bleeding-edge performance.
- **Tailwind CSS**: For rapid, consistent styling.
- **Framer Motion**: The secret sauce for smooth transitions.
- **Lucide Icons**: Clean, light icons for a minimal look.

## Design Patterns
I used "Glow Sheets" (blurred radial gradients) to create depth without using heavy shadows. Everything is built on a strict grid-overlay system to maintain visual rhythm.

### Code Snippet
\`\`\`tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  className="glass rounded-3xl p-8"
>
  {/* Content */}
</motion.div>
\`\`\`

Conclusion: Less is more when you have the right light.
    `,
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "https://images.unsplash.com/photo-155066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-05-10') },
    readTime: "12 min",
    isFeatured: true
  },
  {
    id: 'best-vs-code-extensions-for-developers',
    title: "Best VS Code Extensions for Developers",
    category: "Development",
    description: "My favorite VS Code extensions for productivity, cleaner workflow, and faster development.",
    content: "Content for VS Code extensions...",
    tags: ["VS Code", "Productivity"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-05-08') },
    readTime: "8 min"
  },
  {
    id: 'building-ai-automation-systems',
    title: "Building AI Automation Systems",
    category: "AI",
    description: "How I create AI-powered automation systems using APIs, Node.js, and modern workflows.",
    content: "Content for AI automation...",
    tags: ["AI", "Automation", "Node.js"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-05-05') },
    readTime: "15 min"
  },
  {
    id: 'modern-ui-design-trends-in-2026',
    title: "Modern UI Design Trends in 2026",
    category: "Design",
    description: "Exploring futuristic UI trends, glassmorphism, motion design, and modern web experiences.",
    content: "Content for UI trends...",
    tags: ["UI/UX", "Design"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-05-01') },
    readTime: "10 min"
  },
  {
    id: 'creating-fast-websites-with-nextjs',
    title: "Creating Fast Websites with Next.js",
    category: "Frontend",
    description: "Performance optimization tips and scalable architecture for modern web applications.",
    content: "Content for Next.js performance...",
    tags: ["Next.js", "Performance"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-04-28') },
    readTime: "18 min"
  },
  {
    id: 'my-development-setup-and-workflow',
    title: "My Development Setup & Workflow",
    category: "Productivity",
    description: "A complete look at my coding setup, tools, development environment, and workflow process.",
    content: "Content for dev setup...",
    tags: ["Setup", "Workflow"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000",
    createdAt: { toDate: () => new Date('2026-04-25') },
    readTime: "5 min"
  }
];
