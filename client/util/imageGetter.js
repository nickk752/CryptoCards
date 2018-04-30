
import aBallCard from '../util/images/aballcard.svg';


export default function imageGetter(index) {
  console.log(index)
  const imageMap = ['aballcard', 'acarcard', 'angrygreendudecard', 'dogecard', 'evilKittycard', 'fireballcard', 'flowey', 'friedpotatocard', 'glitzycatcard', 'lovelybonescard'];
  
  const moddedIndex = index % imageMap.length;
  const imageUrl = 'images/' + imageMap[moddedIndex] + '.svg';
  const image = require('../util/images/' + imageMap[moddedIndex] + '.svg');
  // console.log(imageUrl + moddedIndex);
  return image;
}
