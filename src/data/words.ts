/**
 * Answer pool for the Wordle game in src/scripts/game.ts.
 *
 * These are the words that can actually BE the answer — common, fair, no proper
 * nouns. Kept small and embedded so the game is playable the instant the script
 * runs.
 *
 * The list of words you are ALLOWED TO GUESS is a different, much larger thing:
 * ~14.8k five-letter words in `public/words.txt`, fetched lazily by the game.
 * Hand-curating that list was a mistake — it kept rejecting ordinary words like
 * SPELL. Every word here is guaranteed to be in that dictionary too.
 */

export const WORDS = [
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
  'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
  'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit', 'avoid', 'awake', 'award',
  'aware', 'badly', 'baker', 'bases', 'basic', 'beach', 'began', 'begin', 'being', 'below',
  'bench', 'birth', 'black', 'blame', 'blank', 'blast', 'blind', 'block', 'blood', 'board',
  'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brief',
  'bring', 'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'carry', 'catch',
  'cause', 'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest',
  'chief', 'child', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'climb',
  'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft',
  'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'crude', 'curve', 'cycle',
  'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'doing', 'doubt',
  'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove',
  'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter',
  'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
  'fault', 'fibre', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash',
  'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame',
  'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given', 'glass',
  'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross',
  'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harsh', 'heart', 'heavy',
  'hence', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'index', 'inner', 'input',
  'issue', 'joint', 'judge', 'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer',
  'learn', 'lease', 'least', 'leave', 'legal', 'level', 'light', 'limit', 'links', 'lives',
  'local', 'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker',
  'march', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus',
  'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie',
  'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse',
  'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel', 'paper',
  'party', 'peace', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain',
  'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
  'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
  'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right', 'rival',
  'river', 'rough', 'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score',
  'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell',
  'shift', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight', 'since', 'sixth', 'sixty',
  'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smoke', 'solid', 'solve',
  'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split',
  'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel',
  'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck',
  'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste',
  'taxes', 'teach', 'teeth', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick',
  'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight', 'times', 'tired',
  'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train',
  'treat', 'trend', 'trial', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice',
  'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual',
  'valid', 'value', 'video', 'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water',
  'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world',
  'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield',
  'young', 'youth',
] as const;

/** Fallback guess set, used only until public/words.txt has loaded. */
export const WORD_SET: ReadonlySet<string> = new Set<string>(WORDS);

/** Where the full ~14.8k-word guess dictionary lives, relative to the site base. */
export const DICTIONARY_URL = 'words.txt';
