import type { SaveTheDate } from './types'

/*
 * What the builder opens with. A filled example rather than an empty form,
 * because the live preview is the whole pitch — an empty jewel case sells
 * nothing. Every field is meant to be replaced.
 */
export function starterDoc(): SaveTheDate {
  return {
    v: 1,
    names: ['Alex', 'Sam'],
    date: '2027-06-12',
    time: '16:30',
    venue: 'The Bell Foundry',
    city: 'Hudson, New York',
    dateNote: 'Dinner and dancing to follow.',
    travel: [
      {
        id: 'travel-fly',
        heading: 'By train',
        body: 'Fly into Albany, or take Amtrak from Penn Station to Hudson. The venue is ten minutes from the station.',
      },
      {
        id: 'travel-stay',
        heading: 'Staying over',
        body: 'We have a room block at the Rivertown Lodge. There are plenty of rentals in town, but they go early in June.',
      },
    ],
    faqs: [
      {
        id: 'faq-invite',
        q: 'Is this the invitation?',
        a: 'Not yet. The real one comes later this year. This is just so you can book the weekend.',
      },
      {
        id: 'faq-kids',
        q: 'Can we bring the kids?',
        a: 'We love your kids. We are also throwing a party until two in the morning. You decide.',
      },
    ],
    playlist: 'https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gmx',
    note: 'Every song on it is one of ours. Add the song you want to dance to.',
    website: '',
    album: 'Save the date',
    theme: 'indie',
    coverImage: '',
    discImage: '',
  }
}
