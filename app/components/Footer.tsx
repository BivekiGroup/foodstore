import Link from 'next/link';
import { client } from '../lib/sanity';

async function getData() {
  const query = "*[_type == 'footer'][0]";
  const data = await client.fetch(query);
  return data;
}

export default async function Footer() {
  const data = await getData();
  return (
    <footer className="mt-16 bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">О нас</h3>
            <p className="text-gray-400 leading-relaxed">{data.about}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  href="/all"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Продукты
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">&copy; 2024 Все права защищены</p>
            <p className="text-gray-400">
              Разработка сайта{' '}
              <a
                href="https://biveki.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition duration-300"
              >
                BivekiGroup
              </a>
            </p>
            <p className="text-sm text-gray-400">
              Только для лиц старше 18 лет
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
