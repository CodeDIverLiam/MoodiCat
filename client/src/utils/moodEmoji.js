export const getMoodEmoji = (mood) => {
  if (!mood) return '😐';
  
  const moodLower = mood.toLowerCase().trim();
  
  const moodMap = {
    'happy': '😊',
    'joy': '😊',
    'joyful': '😊',
    'excited': '🤩',
    'great': '😄',
    'wonderful': '😄',
    'fantastic': '😄',
    '开心': '😊',
    '高兴': '😊',
    '快乐': '😊',
    '兴奋': '🤩',
    '激动': '🤩',
    '愉快': '😊',
    '幸福': '😊',
    '喜悦': '😊',
    '欣喜': '😊',
    'sad': '😢',
    'depressed': '😢',
    'down': '😢',
    'upset': '😢',
    '难过': '😢',
    '悲伤': '😢',
    '伤心': '😢',
    '沮丧': '😢',
    '失落': '😢',
    'angry': '😠',
    'mad': '😠',
    'furious': '😠',
    '生气': '😠',
    '愤怒': '😠',
    '恼火': '😠',
    'anxious': '😰',
    'worried': '😰',
    'nervous': '😰',
    'stressed': '😰',
    '焦虑': '😰',
    '担心': '😰',
    '紧张': '😰',
    '不安': '😰',
    '压力': '😰',
    'calm': '😌',
    'peaceful': '😌',
    'relaxed': '😌',
    '平静': '😌',
    '放松': '😌',
    '安心': '😌',
    'tired': '😴',
    'exhausted': '😴',
    'sleepy': '😴',
    '累': '😴',
    '疲惫': '😴',
    '疲倦': '😴',
    '困': '😴',
    'grateful': '🙏',
    'thankful': '🙏',
    'blessed': '🙏',
    '感激': '🙏',
    '感恩': '🙏',
    '感谢': '🙏',
    'content': '😊',
    'satisfied': '😊',
    '满足': '😊',
    '满意': '😊',
    'frustrated': '😤',
    'annoyed': '😤',
    'irritated': '😤',
    '沮丧': '😤',
    '烦恼': '😤',
    '烦躁': '😤',
    'confused': '😕',
    'unsure': '😕',
    '困惑': '😕',
    '迷茫': '😕',
    '疑惑': '😕',
    'surprised': '😮',
    'shocked': '😮',
    '惊讶': '😮',
    '吃惊': '😮',
    '震惊': '😮',
    'neutral': '😐',
    'okay': '😐',
    'fine': '😐',
    'meh': '😐',
    '中性': '😐',
    '一般': '😐',
    '普通': '😐',
    '还行': '😐',
    'love': '😍',
    'loved': '😍',
    'romantic': '😍',
    '爱': '😍',
    '喜欢': '😍',
    '恋爱': '😍',
    'proud': '😎',
    'confident': '😎',
    '骄傲': '😎',
    '自信': '😎',
    '自豪': '😎',
    'motivated': '💪',
    'energetic': '💪',
    '有动力': '💪',
    '充满活力': '💪',
    '精力充沛': '💪',
    'lonely': '😔',
    '孤独': '😔',
    '孤单': '😔',
    'bored': '😑',
    '无聊': '😑',
    '无趣': '😑',
    'disappointed': '😞',
    '失望': '😞',
    'overwhelmed': '😵',
    '不知所措': '😵',
    '崩溃': '😵',
    'sick': '🤒',
    'ill': '🤒',
    '生病': '🤒',
    '不舒服': '🤒'
  };
  
  for (const [key, emoji] of Object.entries(moodMap)) {
    if (moodLower.includes(key)) {
      return emoji;
    }
  }
  
  return '😐';
};

export const getMoodColor = (mood) => {
  if (!mood) return 'bg-gray-100 text-gray-800';
  
  const moodLower = mood.toLowerCase().trim();
  
  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited') || 
      moodLower.includes('great') || moodLower.includes('wonderful') || moodLower.includes('fantastic') ||
      moodLower.includes('content') || moodLower.includes('satisfied') || moodLower.includes('love') ||
      moodLower.includes('proud') || moodLower.includes('confident') || moodLower.includes('grateful') ||
      moodLower.includes('开心') || moodLower.includes('高兴') || moodLower.includes('快乐') ||
      moodLower.includes('兴奋') || moodLower.includes('激动') || moodLower.includes('愉快') ||
      moodLower.includes('幸福') || moodLower.includes('满足') || moodLower.includes('满意') ||
      moodLower.includes('感激') || moodLower.includes('感恩') || moodLower.includes('感谢') ||
      moodLower.includes('爱') || moodLower.includes('喜欢') || moodLower.includes('恋爱') ||
      moodLower.includes('骄傲') || moodLower.includes('自信') || moodLower.includes('自豪') ||
      moodLower.includes('有动力') || moodLower.includes('充满活力') || moodLower.includes('精力充沛')) {
    return 'bg-green-100 text-green-800';
  }
  
  if (moodLower.includes('sad') || moodLower.includes('depressed') || moodLower.includes('down') ||
      moodLower.includes('upset') || moodLower.includes('lonely') || moodLower.includes('disappointed') ||
      moodLower.includes('难过') || moodLower.includes('悲伤') || moodLower.includes('伤心') ||
      moodLower.includes('沮丧') || moodLower.includes('失落') || moodLower.includes('失望') ||
      moodLower.includes('孤独') || moodLower.includes('孤单')) {
    return 'bg-red-100 text-red-800';
  }
  
  if (moodLower.includes('anxious') || moodLower.includes('worried') || moodLower.includes('nervous') ||
      moodLower.includes('stressed') || moodLower.includes('overwhelmed') ||
      moodLower.includes('焦虑') || moodLower.includes('担心') || moodLower.includes('紧张') ||
      moodLower.includes('不安') || moodLower.includes('压力') || moodLower.includes('不知所措') ||
      moodLower.includes('崩溃')) {
    return 'bg-orange-100 text-orange-800';
  }
  
  if (moodLower.includes('angry') || moodLower.includes('mad') || moodLower.includes('furious') ||
      moodLower.includes('frustrated') || moodLower.includes('annoyed') || moodLower.includes('irritated') ||
      moodLower.includes('生气') || moodLower.includes('愤怒') || moodLower.includes('恼火') ||
      moodLower.includes('烦恼') || moodLower.includes('烦躁')) {
    return 'bg-red-100 text-red-800';
  }
  
  if (moodLower.includes('calm') || moodLower.includes('peaceful') || moodLower.includes('relaxed') ||
      moodLower.includes('平静') || moodLower.includes('放松') || moodLower.includes('安心')) {
    return 'bg-blue-100 text-blue-800';
  }
  
  if (moodLower.includes('tired') || moodLower.includes('exhausted') || moodLower.includes('sleepy') ||
      moodLower.includes('累') || moodLower.includes('疲惫') || moodLower.includes('疲倦') ||
      moodLower.includes('困')) {
    return 'bg-purple-100 text-purple-800';
  }
  
  return 'bg-gray-100 text-gray-800';
};
