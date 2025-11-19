/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function GameCard({ id, title, description, imageUrl }) {
  return (
    <Link href={`/games/${id}`} className="block group">
      <div className="w-72 bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-32 object-cover" 
        />
        <div className="flex-1 flex flex-col p-4 justify-between">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-300">{description}</p>
        </div>
      </div>
    </Link>
  );
}