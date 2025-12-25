import Andrey from '../img/Andrey.png';
import Dasha from '../img/Dasha.png';
import Ekaterina from '../img/Ekaterina.png';
import Ksenia from '../img/Ksenia.png';
import Misha from '../img/Misha.png';
import Natasha from '../img/Natasha.png';
import Nikita_Bes from '../img/Nikita_Bes.png';
import Nikita_Pre from '../img/Nikita_Pre.png';
import Olesya from '../img/Olesya.png';
import type { Player, Question } from "../types";

export const gameQuestions: Question[] = [
  { question: `В XIX веке этим словом могли называть не только металлические нити, но и сам наряд, щедро украшенный такими нитями. Один из русских писателей в одном из своих произведений употребил это слово в значении "нарядная, но безвкусная одежда". `, word: "МИШУРА" },
  { question: "В Китае этот зверь не входит в число 12-ти знаков Зодиака, но его образ затмевает многих из них. Считается, что он особенно активизируется в зимнее время, а встреча с ним в канун Нового года сулит мудрость и успех в любых переговорах. О ком идет речь?", word: "ЛИСИЧКА" },
  { question: "В 1975 году в СССР вышел фильм, название которого начинается с этого слова. Главные герои фильма — волшебник и девочка, которые борются со злыми силами. Назовите это прилагательное.", word: "НОВОГОДНИЙ" },
  { question: `По легенде, впервые попробовав его, монах воскликнул "Братья, приходите скорее. Я знаю, какие на вкус звезды!".`, word: "ШАМПАНСКОЕ" },
];

export const initialPlayers: Player[] = [
  // Тройка 1
  { id: 1, name: "Таренкова Катя", score: 0, avatar: Ekaterina },
  { id: 2, name: "Усков Миша", score: 0, avatar: Misha },
  { id: 3, name: "Васильева Ксю", score: 0, avatar: Ksenia },
  // Тройка 2
  { id: 4, name: "Яговкина Наташа", score: 0, avatar: Natasha },
  { id: 5, name: "Чуприлин Андрей", score: 0, avatar: Andrey },
  { id: 6, name: "Беспамятных Никита", score: 0, avatar: Nikita_Bes },
  // Тройка 3
  { id: 7, name: "Прескарьян Никита", score: 0, avatar: Nikita_Pre },
  { id: 8, name: "Давыденко Олеся", score: 0, avatar: Olesya },
  { id: 9, name: "Фролова Даша", score: 0, avatar: Dasha },
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