export interface Prize {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const PRIZES: Prize[] = [
  { id: 1, name: 'Набор бытовой химии', price: 100, image: '🧼' },
  { id: 2, name: 'Электрочайник', price: 300, image: '🫖' },
  { id: 3, name: 'Утюг', price: 500, image: '♨️' },
  { id: 4, name: 'Микроволновка', price: 800, image: '📟' },
  { id: 5, name: 'Смартфон', price: 1500, image: '📱' },
  { id: 6, name: 'Ноутбук', price: 2500, image: '💻' },
  { id: 7, name: 'Холодильник', price: 3000, image: '❄️' },
  { id: 8, name: 'Поездка в Сочи', price: 5000, image: '✈️' },
  { id: 9, name: 'АВТОМОБИЛЬ!', price: 10000, image: '🚗' },
  { id: 10, name: 'Квартира в Москве', price: 25000, image: '🏢' },
];
