export interface HopeBridgeApp {
  id: string;
  name: string;
  icon: string;
  badge: string;
  badgeColor: 'coral' | 'violet' | 'teal' | 'sunny' | 'sky' | 'pink';
  tagline: string;
  category: string;
  description: string;
  highlights: string[];
  curriculum?: string[];
  workflowTitle?: string;
  workflow?: { step: number; title: string; desc: string }[];
  audience: string;
  route?: string;
  url: string;
}

export const HOPE_BRIDGE = {
  name: 'Hope Bridge Digital',
  portalUrl: 'https://hopebirdgedigital.site/',
  email: 'hello@hopebridgedigital.com',
  tagline: 'Calm, Family-First Apps for Autism, Speech & Attention Needs',
  mission: 'Developing calm, evidence-based, and family-first digital tools that empower autistic children and children with speech, language, and attention needs at home, school, and in therapy.',
  
  pillars: [
    {
      icon: '🛡️',
      title: 'Privacy & Family First',
      desc: 'All data stays private on your device. Zero third-party ads, tracking, or unexpected data sharing.',
    },
    {
      icon: '🩺',
      title: 'Therapist & Clinician Guided',
      desc: 'Designed with speech therapists, occupational therapists, and behavioral specialists.',
    },
    {
      icon: '💛',
      title: 'Sensory-Friendly & Calm',
      desc: 'Clutter-free visual designs, soothing pacing, and gentle reinforcement without over-stimulation.',
    },
    {
      icon: '🌍',
      title: 'Bilingual & Accessible',
      desc: 'Full English and Arabic support across speech, picture symbols, and visual learning models.',
    },
  ],

  apps: [
    {
      id: 'angel-artic',
      name: 'Angel Artic',
      icon: '😇',
      badge: 'IN THIS APP',
      badgeColor: 'coral',
      tagline: 'Speak • Play • Shine — Gentle speech sound practice.',
      category: 'Speech Sound Practice',
      description: 'Gentle articulation practice for children learning to produce speech sounds clearly. Structured practice across initial, medial, and final positions with voice detection and visual mouth guides.',
      highlights: [
        '17 speech sounds with comprehensive word decks',
        'Microphone voice-gate requiring genuine vocal effort',
        'Step-by-step visual mouth & tongue placement guides',
        'Custom words with parent voice recordings and photos',
        '100% offline, on-device progress tracking',
      ],
      audience: 'Children with speech sound delays, articulation challenges, or apraxia.',
      url: 'https://hopebirdgedigital.site/',
    },
    {
      id: 'angel-talk',
      name: 'Angel Talk',
      icon: '💬',
      badge: 'AAC APP',
      badgeColor: 'violet',
      tagline: 'A voice for every child — Picture communication (AAC).',
      category: 'Augmentative & Alternative Communication',
      description: 'A gentle Augmentative and Alternative Communication (AAC) app. Helps non-verbal and speech-delayed children express their needs, feelings, and thoughts by tapping picture tiles that speak out loud.',
      highlights: [
        '14,800+ symbols and high-contrast picture tiles',
        'Bilingual natural child and adult voices in English & Arabic',
        'Voice Add: build new communication boards by speaking words',
        'Custom photo support for family, snacks, and favorite items',
        'Visual schedules, social stories, and calm breathing pacer',
      ],
      audience: 'Non-verbal and minimally verbal children, autism (ASD), Down syndrome.',
      route: 'AngelTalk',
      url: 'https://hopebirdgedigital.site/apps/angel-talk',
    },
    {
      id: 'bloom-learn',
      name: 'BloomLearn',
      icon: '🌸',
      badge: 'VISUAL & VIDEO LEARNING',
      badgeColor: 'pink',
      tagline: 'Say it. See it. Learn it.',
      category: 'Interactive AI & Video Learning Platform',
      description: 'An interactive AI-powered learning platform that transforms words, sentences, and mathematical concepts into visual experiences. Children can speak or type a sentence and instantly see its meaning illustrated on screen, or explore structured video-based learning for Grades 1–5 in English, Mathematics, and Science.',
      highlights: [
        'AI Text-to-Visual Learning: Every typed or spoken sentence is transformed into an instant visual illustration.',
        'Interactive Spatial Learning: Understand positions such as under, above, behind, beside, and between through interactive scenes.',
        'Visual Mathematics: Learn numbers, calculations, shapes, and mathematical story problems through pictures and animations.',
        'Video-Based Learning: Watch educational videos organized by topic, subject, and grade level with step-by-step visuals.',
        'Grade-Based Curriculum (Grades 1–5): Structured learning content covering English, Mathematics, and Science.',
        'Topic-Wise Lessons & Quizzes: Organized chapters, explanatory videos, visual examples, and practice activities.',
      ],
      curriculum: ['Grades 1–5', 'English', 'Mathematics', 'Science'],
      workflowTitle: 'Video Learning Workflow',
      workflow: [
        { step: 1, title: 'Select Grade', desc: 'Choose Grade 1, 2, 3, 4, or 5.' },
        { step: 2, title: 'Choose Subject', desc: 'English, Mathematics, or Science.' },
        { step: 3, title: 'Select Topic', desc: 'Browse chapters and individual learning topics.' },
        { step: 4, title: 'Watch Educational Video', desc: 'Learn through animated explanations, illustrations, and examples.' },
        { step: 5, title: 'Practice and Test', desc: 'Complete interactive exercises, quizzes, and topic-based questions.' },
        { step: 6, title: 'Track Progress', desc: 'Monitor completed videos, quiz scores, and learning progress.' },
      ],
      audience: 'Children learning reading, grammar, math, science, and spatial concepts in Grades 1–5.',
      url: 'https://hopebirdgedigital.site/',
    },
    {
      id: 'bloom-focus',
      name: 'Bloom Focus',
      icon: '🎯',
      badge: 'ATTENTION & COGNITION',
      badgeColor: 'teal',
      tagline: 'Little minds. Big focus. — Attention & cognitive development.',
      category: 'Attention & Cognitive Development',
      description: 'Adaptive focus games guided by therapists and played at home to help children build attention span, working memory, and task persistence one playful activity at a time.',
      highlights: [
        'Therapist-guided adaptive attention building activities',
        'Calm game mechanics with zero hyper-stimulating flashing lights',
        'Gradual difficulty scaling tailored to the child’s pace',
        'Strengthens working memory, impulse control, and sustained focus',
        'Daily short play sessions to prevent mental fatigue',
      ],
      audience: 'Children with ADHD, attention difficulties, and sensory processing needs.',
      url: 'https://hopebirdgedigital.site/',
    },
    {
      id: 'nexia-bridge',
      name: 'Nexia Bridge',
      icon: '🤝',
      badge: 'CARE COLLABORATION',
      badgeColor: 'sky',
      tagline: 'One child. One team. One shared picture.',
      category: 'Care Team Collaboration Platform',
      description: 'Connects the child’s entire support ecosystem—parents, teachers, ABA therapists, speech therapists (SLPs), occupational therapists (OT), and clinic administrators—into a single unified record tracking progress.',
      highlights: [
        'Unified progress tracking bridging clinic, school, and home',
        'Role-based secure portals for parents, therapists, and educators',
        'Shared clinical goals, milestone tracking, and session notes',
        'Prevents fragmented care across multiple independent specialists',
        'Safe, privacy-first communication for the child’s care circle',
      ],
      audience: 'Parents, SLPs, OTs, ABA therapists, teachers, and clinic directors.',
      url: 'https://hopebirdgedigital.site/',
    },
  ] as HopeBridgeApp[],

  standards: [
    { title: 'Privacy-First Architecture', desc: 'No personal identification, names, emails, or location tracked from children.' },
    { title: 'Zero Third-Party Advertising', desc: 'No banner ads, popups, or external ad networks exist in any child interface.' },
    { title: 'On-Device Data Storage', desc: 'Audio recordings, practice scores, and custom photos remain strictly on your device.' },
    { title: 'Parent PIN Protection', desc: 'All settings, data export, and external links are locked behind parent controls.' },
  ],
};
