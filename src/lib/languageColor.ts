export default function getLanguageColor(language: string) {
  switch (language) {
    case 'swift':
      return 'bg-[#f05138] text-gray-100!'
    case 'js':
      return 'bg-[#f7df1e] text-gray-600!'
    case 'rust':
      return 'bg-[#dea584] text-gray-100!'
    case 'ruby':
      return 'bg-[#cc342d] text-gray-100!'
  }

  return undefined
}
