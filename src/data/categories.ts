import { CategoryMeta, VocabularyCategory } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'daily',
    name: 'Cotidiano',
    iconName: 'Coffee',
    description: 'Rotina, hábitos, casa e situações do dia a dia.',
    color: 'from-violet-500 to-purple-600',
    badge: 'Essencial',
  },
  {
    id: 'travel',
    name: 'Viagens',
    iconName: 'Plane',
    description: 'Aeroporto, hotel, direções e turismo.',
    color: 'from-indigo-500 to-violet-600',
    badge: 'Popular',
  },
  {
    id: 'work',
    name: 'Trabalho',
    iconName: 'Briefcase',
    description: 'Reuniões, e-mails, escritório e carreira.',
    color: 'from-purple-600 to-violet-700',
    badge: 'Profissional',
  },
  {
    id: 'tech',
    name: 'Tecnologia',
    iconName: 'Cpu',
    description: 'Software, hardware, inovação e inteligência.',
    color: 'from-violet-600 to-purple-800',
    badge: 'Moderno',
  },
  {
    id: 'internet',
    name: 'Internet & Redes',
    iconName: 'Globe',
    description: 'Mídias sociais, memes, navegação e termos online.',
    color: 'from-purple-500 to-indigo-600',
    badge: 'Em Alta',
  },
  {
    id: 'gaming',
    name: 'Jogos & Cultura Pop',
    iconName: 'Gamepad2',
    description: 'Games, streaming, termos competitivos e fandom.',
    color: 'from-violet-500 to-purple-700',
    badge: 'Divertido',
  },
  {
    id: 'cinema',
    name: 'Filmes & Séries',
    iconName: 'Film',
    description: 'Cinema, roteiros, entretenimento e resenhas.',
    color: 'from-purple-600 to-indigo-700',
    badge: 'Cultura',
  },
  {
    id: 'music',
    name: 'Música',
    iconName: 'Music',
    description: 'Gêneros, instrumentos, shows e letras.',
    color: 'from-violet-400 to-purple-600',
    badge: 'Arte',
  },
  {
    id: 'food',
    name: 'Comida & Bebida',
    iconName: 'UtensilsCrossed',
    description: 'Restaurante, culinária, ingredientes e sabores.',
    color: 'from-purple-500 to-violet-600',
    badge: 'Saboroso',
  },
  {
    id: 'feelings',
    name: 'Sentimentos & Emoções',
    iconName: 'Heart',
    description: 'Humor, reações, psicologia e estados de espírito.',
    color: 'from-violet-600 to-purple-500',
    badge: 'Expressivo',
  },
  {
    id: 'relationships',
    name: 'Relacionamentos',
    iconName: 'Users',
    description: 'Amizades, encontros, convivência e família.',
    color: 'from-indigo-500 to-purple-600',
    badge: 'Social',
  },
  {
    id: 'slang',
    name: 'Gírias Populares',
    iconName: 'Flame',
    description: 'Expressões urbanas, gírias atuais e linguagem das ruas.',
    color: 'from-violet-600 to-fuchsia-600',
    badge: 'Nativo',
  },
  {
    id: 'idioms',
    name: 'Expressões Idiomáticas',
    iconName: 'Sparkles',
    description: 'Provérbios, metáforas e expressões consagradas.',
    color: 'from-purple-600 to-violet-800',
    badge: 'Fluência',
  },
  {
    id: 'business',
    name: 'Negócios & Mercado',
    iconName: 'TrendingUp',
    description: 'Finanças, vendas, negociações e startups.',
    color: 'from-indigo-600 to-violet-700',
    badge: 'Estratégico',
  },
];

export function getCategoryMeta(id: VocabularyCategory): CategoryMeta {
  const found = CATEGORIES.find((c) => c.id === id);
  if (found) return found;
  return {
    id: 'daily',
    name: 'Geral',
    iconName: 'BookOpen',
    description: 'Vocabulário geral',
    color: 'from-violet-500 to-purple-600',
    badge: 'Geral',
  };
}
