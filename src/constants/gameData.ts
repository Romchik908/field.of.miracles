import type { Player, Question } from "../types";

export const gameQuestions: Question[] = [
  { question: "Раунд 1. Структурированный набор данных", word: "МАССИВ" },
  { question: "Раунд 2. Процесс преобразования кода", word: "КОМПИЛЯЦИЯ" },
  { question: "Раунд 3. Последовательность действий", word: "АЛГОРИТМ" },
  { question: "ФИНАЛ. Главный инструмент программиста", word: "КЛАВИАТУРА" },
];

export const initialPlayers: Player[] = [
  // Тройка 1
  { id: 1, name: "Кот Матроскин", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { id: 2, name: "Винни-Пух", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bear" },
  { id: 3, name: "Почтальон Печкин", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peckin" },
  // Тройка 2
  { id: 4, name: "Карлсон", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karl" },
  { id: 5, name: "Волк", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wolf" },
  { id: 6, name: "Заяц", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bunny" },
  // Тройка 3
  { id: 7, name: "Шапокляк", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shapok" },
  { id: 8, name: "Кеша", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kesha" },
  { id: 9, name: "Фрекен Бок", score: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bok" },
];

export const drumSectors = [
  'П', 500, 750, 1000, 'x2', 500, 400, 600, 
  '+', 700, 800, 450, 500, 600, 1500, 
  'Ш', 350, 550, 900, 600, 400, 850, 
  'x2', 500, 700, 600
];

export const KEY_MAP: Record<string, string> = {
  KeyQ: 'Й', KeyW: 'Ц', KeyE: 'У', KeyR: 'К', KeyT: 'Е', KeyY: 'Н', KeyU: 'Г', KeyI: 'Ш', KeyO: 'Щ', KeyP: 'З', BracketLeft: 'Х', BracketRight: 'Ъ',
  KeyA: 'Ф', KeyS: 'Ы', KeyD: 'В', KeyF: 'А', KeyG: 'П', KeyH: 'Р', KeyJ: 'О', KeyK: 'Л', KeyL: 'Д', Semicolon: 'Ж', Quote: 'Э',
  KeyZ: 'Я', KeyX: 'Ч', KeyC: 'С', KeyV: 'М', KeyB: 'И', KeyN: 'Т', KeyM: 'Ь', Comma: 'Б', Period: 'Ю', Backquote: 'Ё'
};