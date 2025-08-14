
export default function getCategoryColor(category: string) {
  const colors = {
    fashion: "bg-pink-100 text-pink-800 border-pink-200",
    electronics: "bg-blue-100 text-blue-800 border-blue-200",
    beauty: "bg-purple-100 text-purple-800 border-purple-200",
    food: "bg-orange-100 text-orange-800 border-orange-200",
    home: "bg-green-100 text-green-800 border-green-200",
    health: "bg-red-100 text-red-800 border-red-200",
    automotive: "bg-gray-100 text-gray-800 border-gray-200",
    sports: "bg-yellow-100 text-yellow-800 border-yellow-200",
    books: "bg-indigo-100 text-indigo-800 border-indigo-200",
    art: "bg-teal-100 text-teal-800 border-teal-200",
    other: "bg-slate-100 text-slate-800 border-slate-200",
  };
  return colors[category as keyof typeof colors] || colors.other;
}
