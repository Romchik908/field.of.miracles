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
  '+', 400, 700, 600, 'x2', 600, 500, 400, 650, 450, 
  1500, 1000, 500, 350, 550, 750, 600, 500, 350, 400, 
  'x2', 600, 500, 'П', 600, 350, 300, 200, 500, 600, 
  400, 'Ш', 500, 350, 500, 400, 450, 500, 350, 600
];

export const KEY_MAP: Record<string, string> = {
  KeyQ: 'Й', KeyW: 'Ц', KeyE: 'У', KeyR: 'К', KeyT: 'Е', KeyY: 'Н', KeyU: 'Г', KeyI: 'Ш', KeyO: 'Щ', KeyP: 'З', BracketLeft: 'Х', BracketRight: 'Ъ',
  KeyA: 'Ф', KeyS: 'Ы', KeyD: 'В', KeyF: 'А', KeyG: 'П', KeyH: 'Р', KeyJ: 'О', KeyK: 'Л', KeyL: 'Д', Semicolon: 'Ж', Quote: 'Э',
  KeyZ: 'Я', KeyX: 'Ч', KeyC: 'С', KeyV: 'М', KeyB: 'И', KeyN: 'Т', KeyM: 'Ь', Comma: 'Б', Period: 'Ю', Backquote: 'Ё'
};