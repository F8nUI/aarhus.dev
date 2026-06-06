export default function getTopicColor(topic: string) {
  switch (topic) {
    case 'swift':
      return 'bg-[#f05138] text-gray-100!'
    case 'js':
      return 'bg-[#f7df1e] text-gray-600!'
    case 'rust':
      return 'bg-[#dea584] text-gray-100!'
    case 'go':
      return 'bg-[#00add8] text-gray-100!'
    case 'ruby':
      return 'bg-[#cc342d] text-gray-100!'
  }

  return undefined
}
