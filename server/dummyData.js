import Post from './models/post';
import Card from './models/card';
import Deck from './models/deck';

export default function () {
  Deck.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    //bob decks
    const deck1 = new Deck({ number: 1, name: 'This Deck', owner: 'bob', active: false, slug: 'This Deck', cuid: 'aaa' });
    const deck2 = new Deck({ number: 2, name: 'That Deck', owner: 'bob', active: false, slug: 'That Deck', cuid: 'bbb' });
    const deck3 = new Deck({ number: 3, name: 'Best Deck', owner: 'bob', active: false, slug: 'Best Deck', cuid: 'ccc' });
    const deck4 = new Deck({ number: 4, name: 'Worst Deck', owner: 'bob', active: false, slug: 'Worst Deck', cuid: 'ddd' });
    const deck5 = new Deck({ number: 5, name: 'The Deck', owner: 'bob', active: false, slug: 'The Deck', cuid: 'eee' });

    // charles decks
    const deck6 = new Deck({ number: 1, name: 'ayy', owner: 'charles', active: false, slug: 'ayy', cuid: 'fff' });
    const deck7 = new Deck({ number: 2, name: 'byy', owner: 'charles', active: false, slug: 'byy', cuid: 'ggg' });
    const deck8 = new Deck({ number: 3, name: 'cyy', owner: 'charles', active: false, slug: 'cyy', cuid: 'hhh' });
    const deck9 = new Deck({ number: 4, name: 'dyy', owner: 'charles', active: false, slug: 'dyy', cuid: 'iii' });
    const deck10 = new Deck({ number: 5, name: 'eyy', owner: 'charles', active: false, slug: 'eyy', cuid: 'jjj' });

    Deck.create([deck1, deck2, deck3, deck4, deck5, deck6, deck7, deck8, deck9, deck10], (error) => {
      if (!error) {
        console.log('Added decks for first go');
      }
    });
  });

  Card.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    // bob cards
    const card1 = new Card({ name: 'lil Punchy', owner: 'bob', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 1, defense: 1, effect: ' ', decks: ['aaa', 'bbb', 'eee'], slug: 'lil Punchy', cuid: 'aaaa', tokenId: 10000 });
    const card2 = new Card({ name: 'lil blocky', owner: 'bob', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 0, defense: 2, effect: ' ', decks: ['bbb', 'ccc', 'ddd', 'eee'], slug: 'lil blocky', cuid: 'bbbb', tokenId: 10001  });
    const card3 = new Card({ name: 'ayy blocky', owner: 'bob', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 1, defense: 2, effect: ' ', decks: ['bbb', 'ccc', 'eee'], slug: 'ayy blocky', cuid: 'cccc', tokenId: 10002 });
    const card4 = new Card({ name: 'wut blocky', owner: 'bob', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 3, defense: 5, effect: ' ', decks: ['ccc', 'ddd', 'eee'], slug: 'wut blocky', cuid: 'dddd', tokenId: 10003 });
    const card5 = new Card({ name: 'how blocky', owner: 'bob', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 5, defense: 2, effect: ' ', decks: ['bbb', 'eee'], slug: 'how blocky', cuid: 'eeee' , tokenId: 10004});

    // charles cards
    const card6 = new Card({ name: 'Mid Blocky', owner: 'charles', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 1, defense: 1, effect: ' ', decks: ['fff', 'hhh', 'jjj'], slug: 'Mid Blocky', cuid: 'ffff' , tokenId: 10005});
    const card7 = new Card({ name: 'Mid Punchy', owner: 'charles', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 1, defense: 7, effect: ' ', decks: ['ggg', 'fff', 'hhh', 'iii'], slug: 'Mid Punchy', cuid: 'gggg' , tokenId: 10006});
    const card8 = new Card({ name: 'Mid Bonchon', owner: 'charles', type: 'Creature', nCost: 1, lCost: 0, rCost: 3, attack: 4, defense: 1, effect: ' ', decks: ['fff', 'hhh', 'iii'], slug: 'Mid Bonchon', cuid: 'hhhh' , tokenId: 10007});
    const card9 = new Card({ name: 'Mid Wonchon', owner: 'charles', type: 'Creature', nCost: 1, lCost: 0, rCost: 0, attack: 2, defense: 1, effect: ' ', decks: ['ggg', 'fff', 'iii'], slug: 'Mid Wonchon', cuid: 'iiii' , tokenId: 10008});
    const card10 = new Card({ name: 'Mid Lanchon', owner: 'charles', type: 'Creature', nCost: 1, lCost: 2, rCost: 0, attack: 1, defense: 4, effect: ' ', decks: ['hhh', 'iii'], slug: 'Mid Lanchon', cuid: 'jjjj' , tokenId: 10009});

    Card.create([card1, card2, card3, card4, card5, card6, card7, card8, card9, card10], (error) => {
      if (!error) {
        console.log('Added cards for first go');
      }
      else {
        console.log(error);
      }
    });
  });

  Post.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const content1 = `Sed ut perspiciatis unde omnis iste natus error
      sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
      eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
      vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
      aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
      qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
      ipsum quia dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
      enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
      ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
      in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
      occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum`;

    const content2 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
      enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
      ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
      in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
      occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum. Sed ut perspiciatis unde omnis iste natus error
      sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
      eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
      vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
      aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
      qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
      ipsum quia dolor sit amet.`;

    const post1 = new Post({ name: 'Admin', title: 'Hello MERN', slug: 'hello-mern', cuid: 'cikqgkv4q01ck7453ualdn3hd', content: content1 });
    const post2 = new Post({ name: 'Admin', title: 'Lorem Ipsum', slug: 'lorem-ipsum', cuid: 'cikqgkv4q01ck7453ualdn3hf', content: content2 });

    Post.create([post1, post2], (error) => {
      if (!error) {
        // console.log('ready to go....');
      }
    });
  });
}
