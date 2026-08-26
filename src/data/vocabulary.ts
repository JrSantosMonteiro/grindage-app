import { AppLanguage, StudyLanguage, VocabularyItem } from '../types';
import { SPANISH_VOCABULARY } from './vocabulary/es';
import { FRENCH_VOCABULARY } from './vocabulary/fr';
import { PORTUGUESE_VOCABULARY } from './vocabulary/pt';

// Base English Vocabulary with multi-lingual translations
export const ENGLISH_VOCABULARY: VocabularyItem[] = [
  // --- DAILY ---
  {
    id: 'en_daily_1',
    language: 'en',
    word: 'House',
    translation: 'Casa',
    translations: {
      pt: 'Casa',
      es: 'Casa / Hogar',
      en: 'House / Residence',
      fr: 'Maison / Foyer',
    },
    phonetic: '/haʊs/',
    category: 'daily',
    difficulty: 'basic',
    type: 'word',
    meaning: 'A building for human habitation, especially one that is lived in by a family.',
    meanings: {
      pt: 'Edificação residencial destinada à moradia.',
      es: 'Edificación residencial para vivienda.',
      en: 'A building for human habitation.',
      fr: 'Bâtiment d’habitation individuelle ou familiale.',
    },
    example: 'I am walking back to my house after school.',
    exampleTranslation: 'Estou caminhando de volta para minha casa depois da escola.',
    exampleTranslations: {
      pt: 'Estou caminhando de volta para minha casa depois da escola.',
      es: 'Estoy caminando de vuelta a mi casa después de la escuela.',
      en: 'I am walking back to my house after school.',
      fr: 'Je rentre chez moi à pied après l’école.',
    },
    relatedWords: ['Home', 'Room', 'Building', 'Door'],
    synonyms: ['Home', 'Residence', 'Dwelling'],
    antonyms: ['Street', 'Wilderness'],
    situationTag: 'At home',
  },
  {
    id: 'en_daily_2',
    language: 'en',
    word: 'Break',
    translation: 'Quebrar / Intervalo',
    translations: {
      pt: 'Intervalo / Quebrar',
      es: 'Descanso / Romper',
      en: 'Pause / Break / Shatter',
      fr: 'Pause / Casser',
    },
    phonetic: '/breɪk/',
    category: 'daily',
    difficulty: 'intermediate',
    type: 'word',
    meaning: 'Separate into pieces as a result of a blow, or take a brief pause from work.',
    meanings: {
      pt: 'Fazer uma pausa durante o trabalho ou partir algo em pedaços.',
      es: 'Hacer una pausa en el trabajo o partir en pedazos.',
      en: 'Take a short pause from work or separate into pieces.',
      fr: 'Faire une pause ou briser en morceaux.',
    },
    example: 'Let’s take a ten-minute coffee break.',
    exampleTranslation: 'Vamos fazer um intervalo de dez minutos para o café.',
    exampleTranslations: {
      pt: 'Vamos fazer um intervalo de dez minutos para o café.',
      es: 'Tomemos un descanso de diez minutos para un café.',
      en: 'Let’s take a ten-minute coffee break.',
      fr: 'Prenons une pause café de dix minutes.',
    },
    relatedWords: ['Pause', 'Rest', 'Crack', 'Stop'],
    synonyms: ['Pause', 'Intermission', 'Split'],
    antonyms: ['Continue', 'Fix', 'Assemble'],
    situationTag: 'Daily routine',
  },
  {
    id: 'en_daily_3',
    language: 'en',
    word: 'Schedule',
    translation: 'Cronograma / Agenda',
    translations: {
      pt: 'Cronograma / Agenda',
      es: 'Horario / Cronograma / Agenda',
      en: 'Schedule / Timetable / Plan',
      fr: 'Emploi du temps / Calendrier',
    },
    phonetic: '/ˈskedʒ.uːl/',
    category: 'daily',
    difficulty: 'intermediate',
    type: 'word',
    meaning: 'A plan for carrying out process or procedure, giving lists of intended events and times.',
    meanings: {
      pt: 'Plano organizado com horários para eventos ou tarefas.',
      es: 'Plan de actividades ordenado por fechas y horas.',
      en: 'A planned timetable of events or procedures.',
      fr: 'Planification horaire des événements et des tâches.',
    },
    example: 'Check your daily schedule before leaving the house.',
    exampleTranslation: 'Verifique sua agenda diária antes de sair de casa.',
    exampleTranslations: {
      pt: 'Verifique sua agenda diária antes de sair de casa.',
      es: 'Revisa tu horario diario antes de salir de casa.',
      en: 'Check your daily schedule before leaving the house.',
      fr: 'Vérifiez votre emploi du temps avant de quitter la maison.',
    },
    relatedWords: ['Calendar', 'Routine', 'Time', 'Deadline'],
    synonyms: ['Timetable', 'Agenda', 'Plan'],
    situationTag: 'Organization',
  },
  {
    id: 'en_daily_4',
    language: 'en',
    word: 'Errand',
    translation: 'Tarefa rápida / Recado',
    translations: {
      pt: 'Tarefa rápida / Fazer compras na rua',
      es: 'Recado / Tarea rápida fuera de casa',
      en: 'Short trip to accomplish a specific task',
      fr: 'Course / Petite tâche à l’extérieur',
    },
    phonetic: '/ˈer.ənd/',
    category: 'daily',
    difficulty: 'intermediate',
    type: 'word',
    meaning: 'A short trip taken in the day in order to deliver or collect something.',
    meanings: {
      pt: 'Pequena saída de casa para resolver compras e pendências.',
      es: 'Salida corta para hacer compras o trámites.',
      en: 'A short trip to do something practical.',
      fr: 'Déplacement court pour faire des démarches ou des achats.',
    },
    example: 'I have to run some quick errands at the supermarket.',
    exampleTranslation: 'Preciso fazer algumas tarefas rápidas no supermercado.',
    exampleTranslations: {
      pt: 'Preciso fazer algumas tarefas rápidas no supermercado.',
      es: 'Tengo que hacer unos recados rápidos en el supermercado.',
      en: 'I have to run some quick errands at the supermarket.',
      fr: 'Je dois faire quelques courses rapides au supermarché.',
    },
    relatedWords: ['Chore', 'Task', 'Grocery', 'Shopping'],
    synonyms: ['Task', 'Chore', 'Mission'],
    situationTag: 'Daily chores',
  },

  // --- TRAVEL ---
  {
    id: 'en_travel_1',
    language: 'en',
    word: 'Boarding pass',
    translation: 'Cartão de embarque',
    translations: {
      pt: 'Cartão de embarque',
      es: 'Tarjeta de embarque',
      en: 'Boarding pass / Gate ticket',
      fr: 'Carte d’embarquement',
    },
    phonetic: '/ˈbɔːr.dɪŋ ˌpæs/',
    category: 'travel',
    difficulty: 'basic',
    type: 'expression',
    meaning: 'A pass given to an airline passenger that authorizes boarding an aircraft.',
    meanings: {
      pt: 'Documento impresso ou digital que autoriza a entrada no avião.',
      es: 'Pase que autoriza el acceso a un avión o barco.',
      en: 'A document permitting passage onto a plane or ship.',
      fr: 'Titre d’accès permettant de monter à bord d’un avion.',
    },
    example: 'Please show your passport and boarding pass at the gate.',
    exampleTranslation: 'Por favor, mostre seu passaporte e cartão de embarque no portão.',
    exampleTranslations: {
      pt: 'Por favor, mostre seu passaporte e cartão de embarque no portão.',
      es: 'Por favor, muestre su pasaporte y tarjeta de embarque en la puerta.',
      en: 'Please show your passport and boarding pass at the gate.',
      fr: 'Veuillez présenter votre passeport et votre carte d’embarquement à la porte.',
    },
    relatedWords: ['Gate', 'Flight', 'Luggage', 'Check-in'],
    synonyms: ['Ticket', 'Boarding card'],
    situationTag: 'At the airport',
  },
  {
    id: 'en_travel_2',
    language: 'en',
    word: 'Layover',
    translation: 'Conexão / Escala',
    translations: {
      pt: 'Conexão / Escala de voo',
      es: 'Escala / Conexión de vuelo',
      en: 'Layover / Stopover',
      fr: 'Escale / Correspondance',
    },
    phonetic: '/ˈleɪˌoʊ.vɚ/',
    category: 'travel',
    difficulty: 'intermediate',
    type: 'word',
    meaning: 'A period of waiting between two stages of a trip, especially flights.',
    meanings: {
      pt: 'Período de espera entre voos em um aeroporto intermediário.',
      es: 'Tiempo de espera entre vuelos conectados.',
      en: 'A stop during a journey between flights.',
      fr: 'Temps d’attente entre deux vols.',
    },
    example: 'We had a four-hour layover in London before flying to Tokyo.',
    exampleTranslation: 'Tivemos uma escala de quatro horas em Londres antes de voar para Tóquio.',
    exampleTranslations: {
      pt: 'Tivemos uma escala de quatro horas em Londres antes de voar para Tóquio.',
      es: 'Tuvimos una escala de cuatro horas en Londres antes de volar a Tokio.',
      en: 'We had a four-hour layover in London before flying to Tokyo.',
      fr: 'Nous avons eu une escale de quatre heures à Londres avant de nous envoler pour Tokyo.',
    },
    relatedWords: ['Airport', 'Flight', 'Connecting', 'Terminal'],
    synonyms: ['Stopover', 'Connection'],
    situationTag: 'Traveling',
  },

  // --- WORK ---
  {
    id: 'en_work_1',
    language: 'en',
    word: 'Touch base',
    translation: 'Entrar em contato / Alinhar pontos',
    translations: {
      pt: 'Fazer contato rápido / Alinhar pontos',
      es: 'Ponerse en contacto / Coordinar brevemente',
      en: 'Touch base / Check in briefly',
      fr: 'Faire le point / Prendre contact brièvement',
    },
    phonetic: '/tʌtʃ beɪs/',
    category: 'work',
    difficulty: 'intermediate',
    type: 'idiom',
    meaning: 'To briefly make contact or communicate with someone to update on progress.',
    meanings: {
      pt: 'Conversar rapidamente com alguém para atualizar informações ou alinhar um projeto.',
      es: 'Hacer un contacto breve para actualizarse sobre un tema.',
      en: 'Briefly contact someone for an update.',
      fr: 'Contacter quelqu’un pour faire un rapide point de situation.',
    },
    example: 'Let’s touch base on Monday morning to finalize the client presentation.',
    exampleTranslation: 'Vamos nos falar na segunda-feira de manhã para finalizar a apresentação do cliente.',
    exampleTranslations: {
      pt: 'Vamos nos falar na segunda-feira de manhã para finalizar a apresentação do cliente.',
      es: 'Pongámonos en contacto el lunes por la mañana para finalizar la presentación.',
      en: 'Let’s touch base on Monday morning to finalize the client presentation.',
      fr: 'Faisons le point lundi matin pour finaliser la présentation client.',
    },
    relatedWords: ['Meeting', 'Update', 'Email', 'Team', 'Project'],
    synonyms: ['Connect', 'Check in', 'Catch up'],
    situationTag: 'Office communication',
  },

  // --- SLANG ---
  {
    id: 'en_slang_1',
    language: 'en',
    word: 'No cap',
    translation: 'Sem brincadeira / É verdade / Juro',
    translations: {
      pt: 'Sem brincadeira / É sério / Juro',
      es: 'En serio / Sin mentiras / Te lo juro',
      en: 'No lie / For real / Speaking truthfully',
      fr: 'Sans mentir / Sérieusement / C’est du sérieux',
    },
    phonetic: '/noʊ kæp/',
    category: 'slang',
    difficulty: 'basic',
    type: 'slang',
    meaning: 'Slang phrase meaning for real, telling the pure truth, not exaggerating or lying.',
    meanings: {
      pt: 'Gíria muito usada na internet e entre jovens para dizer que é pura verdade.',
      es: 'Expresión coloquial para afirmar que algo es 100% verdad.',
      en: 'Stating that something is completely true without exaggeration.',
      fr: 'Expression signifiant que l’on dit la vérité sans exagérer.',
    },
    example: 'That concert last night was the best show of the year, no cap!',
    exampleTranslation: 'Aquele show ontem à noite foi o melhor do ano, sem brincadeira!',
    exampleTranslations: {
      pt: 'Aquele show ontem à noite foi o melhor do ano, sem brincadeira!',
      es: 'Ese concierto anoche fue el mejor del año, ¡te lo juro!',
      en: 'That concert last night was the best show of the year, no cap!',
      fr: 'Ce concert hier soir était le meilleur de l’année, sans mentir !',
    },
    relatedWords: ['Truth', 'Honest', 'Real', 'Cap', 'Hype'],
    synonyms: ['For real', 'Honestly', 'No lie'],
    antonyms: ['Capping', 'Lying'],
    situationTag: 'Casual conversation',
  },
  {
    id: 'en_slang_2',
    language: 'en',
    word: 'Ghosting',
    translation: 'Sumir do nada / Cortar contato repentinamente',
    translations: {
      pt: 'Sumir do nada / Cortar contato de repente',
      es: 'Desaparecer sin decir nada / Dejar de responder',
      en: 'Abruptly ending communication with no explanation',
      fr: 'Disparaître soudainement sans donner de nouvelles',
    },
    phonetic: '/ˈɡoʊ.stɪŋ/',
    category: 'slang',
    difficulty: 'basic',
    type: 'slang',
    meaning: 'The practice of suddenly cutting off all contact with someone without giving any explanation.',
    meanings: {
      pt: 'Ignorar mensagens e sumir de um relacionamento ou amizade sem avisar.',
      es: 'Dejar de comunicarse con alguien de golpe y sin explicación.',
      en: 'Cutting off all communication without notice.',
      fr: 'Cesser tout contact de façon abrupte sans explication.',
    },
    example: 'They went on two great dates, but then she started ghosting him.',
    exampleTranslation: 'Eles tiveram dois ótimos encontros, mas depois ela sumiu do nada.',
    exampleTranslations: {
      pt: 'Eles tiveram dois ótimos encontros, mas depois ela sumiu do nada.',
      es: 'Tuvieron dos citas geniales, pero luego ella empezó a desaparecer.',
      en: 'They went on two great dates, but then she started ghosting him.',
      fr: 'Ils ont eu deux super rendez-vous, mais ensuite elle a commencé à le ghoster.',
    },
    relatedWords: ['Texting', 'Dating', 'Ignore', 'Block'],
    synonyms: ['Disappearing', 'Ignoring'],
    situationTag: 'Modern dating',
  },

  // --- IDIOMS ---
  {
    id: 'en_idiom_1',
    language: 'en',
    word: 'Bite the bullet',
    translation: 'Encarar o problema / Aguentar firme uma situação difícil',
    translations: {
      pt: 'Encarar a situação / Engolir o choro e agir',
      es: 'Hacer de tripas corazón / Afrontar lo inevitable',
      en: 'Face a difficult situation with courage',
      fr: 'Serrer les dents / Prendre son courage à deux mains',
    },
    phonetic: '/baɪt ðə ˈbʊl.ɪt/',
    category: 'idioms',
    difficulty: 'intermediate',
    type: 'idiom',
    meaning: 'To face a painful or unpleasant situation that is unavoidable with courage and resolve.',
    meanings: {
      pt: 'Aceitar e enfrentar uma situação difícil ou desconfortável sem hesitar.',
      es: 'Aceptar y enfrentar una situación difícil o desagradable.',
      en: 'Face an unavoidable difficult situation with courage.',
      fr: 'Affronter une situation pénible mais inévitable avec bravoure.',
    },
    example: 'I decided to bite the bullet and tell my boss I was resigning.',
    exampleTranslation: 'Decidi encarar a situação e dizer ao meu chefe que estava me demitindo.',
    exampleTranslations: {
      pt: 'Decidi encarar a situação e dizer ao meu chefe que estava me demitindo.',
      es: 'Decidí hacer de tripas corazón y decirle a mi jefe que renunciaba.',
      en: 'I decided to bite the bullet and tell my boss I was resigning.',
      fr: 'J’ai décidé de serrer les dents et d’annoncer ma démission à mon patron.',
    },
    relatedWords: ['Courage', 'Decide', 'Face', 'Resilience'],
    synonyms: ['Face the music', 'Tough it out'],
    situationTag: 'Tough decisions',
  },
  {
    id: 'en_idiom_2',
    language: 'en',
    word: 'Hit the nail on the head',
    translation: 'Acertar na mosca / Acertar em cheio',
    translations: {
      pt: 'Acertar na mosca / Acertar em cheio',
      es: 'Dar en el clavo / Acertar de pleno',
      en: 'Hit the nail on the head / Be exactly right',
      fr: 'Mettre le doigt dessus / Tomber pile',
    },
    phonetic: '/hɪt ðə neɪl ɒn ðə hed/',
    category: 'idioms',
    difficulty: 'intermediate',
    type: 'idiom',
    meaning: 'Find exactly the right answer or describe a situation with perfect accuracy.',
    meanings: {
      pt: 'Descrever uma situação com extrema precisão ou dizer a resposta exata.',
      es: 'Decir exactamente lo correcto o dar la respuesta precisa.',
      en: 'To say something that is completely accurate or precise.',
      fr: 'Décrire exactement la vérité ou trouver la bonne réponse.',
    },
    example: 'You hit the nail on the head with your analysis of the problem.',
    exampleTranslation: 'Você acertou na mosca com a sua análise do problema.',
    exampleTranslations: {
      pt: 'Você acertou na mosca com a sua análise do problema.',
      es: 'Diste en el clavo con tu análisis del problema.',
      en: 'You hit the nail on the head with your analysis of the problem.',
      fr: 'Tu as mis le doigt dessus avec ton analyse du problème.',
    },
    relatedWords: ['Accurate', 'Correct', 'Insight', 'Analysis'],
    synonyms: ['Be spot on', 'Get it right'],
    situationTag: 'Problem solving',
  },

  // --- FEELINGS ---
  {
    id: 'en_feelings_1',
    language: 'en',
    word: 'Overwhelmed',
    translation: 'Sobrecarregado / Atordoado',
    translations: {
      pt: 'Sobrecarregado / Atordoado',
      es: 'Abrumado / Sobrecargado',
      en: 'Overwhelmed / Overloaded',
      fr: 'Accablé / Submergé',
    },
    phonetic: '/ˌoʊ.vɚˈwelmd/',
    category: 'feelings',
    difficulty: 'intermediate',
    type: 'word',
    meaning: 'Feeling submerged or inundated with too many emotions, tasks, or pressure.',
    meanings: {
      pt: 'Sentir-se incapaz de lidar com o volume de exigências ou emoções.',
      es: 'Sentirse superado por el exceso de tareas o emociones.',
      en: 'Being overcome by strong emotion or excessive responsibilities.',
      fr: 'Être débordé par les tâches ou submergé par l’émotion.',
    },
    example: 'She felt overwhelmed by all the responsibilities at her new job.',
    exampleTranslation: 'Ela se sentiu sobrecarregada com todas as responsabilidades no novo emprego.',
    exampleTranslations: {
      pt: 'Ela se sentiu sobrecarregada com todas as responsabilidades no novo emprego.',
      es: 'Se sintió abrumada por todas las responsabilidades en su nuevo trabajo.',
      en: 'She felt overwhelmed by all the responsibilities at her new job.',
      fr: 'Elle s’est sentie submergée par toutes les responsabilités à son nouveau travail.',
    },
    relatedWords: ['Stress', 'Pressure', 'Emotions', 'Exhausted'],
    synonyms: ['Inundated', 'Swamped', 'Overloaded'],
    antonyms: ['Calm', 'Relaxed', 'Unbothered'],
    situationTag: 'Emotional state',
  },
];

export const INITIAL_VOCABULARY: VocabularyItem[] = ENGLISH_VOCABULARY;

export function getVocabularyByLanguage(lang: StudyLanguage): VocabularyItem[] {
  switch (lang) {
    case 'es':
      return SPANISH_VOCABULARY;
    case 'fr':
      return FRENCH_VOCABULARY;
    case 'pt':
      return PORTUGUESE_VOCABULARY;
    case 'en':
    default:
      return ENGLISH_VOCABULARY;
  }
}

export function getAllVocabulary(): VocabularyItem[] {
  return [...ENGLISH_VOCABULARY, ...SPANISH_VOCABULARY, ...FRENCH_VOCABULARY, ...PORTUGUESE_VOCABULARY];
}

export function getWordTranslation(item: VocabularyItem, appLang: AppLanguage = 'pt'): string {
  if (item.translations && item.translations[appLang]) {
    return item.translations[appLang]!;
  }
  return item.translation || item.word;
}

export function getWordMeaning(item: VocabularyItem, appLang: AppLanguage = 'pt'): string {
  if (item.meanings && item.meanings[appLang]) {
    return item.meanings[appLang]!;
  }
  return item.meaning;
}

export function getWordExampleTranslation(item: VocabularyItem, appLang: AppLanguage = 'pt'): string {
  if (item.exampleTranslations && item.exampleTranslations[appLang]) {
    return item.exampleTranslations[appLang]!;
  }
  return item.exampleTranslation;
}
