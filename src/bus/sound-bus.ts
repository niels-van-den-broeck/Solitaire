import cardMoved from '../audio/card-moved.mp3'
import foundationFilled from '../audio/foundation-filled.mp3'
import stockAccessed from '../audio/stock-accessed.mp3'
import { EventValues, events } from './events';

class SoundBus {
  files: Record<EventValues, HTMLAudioElement | undefined> = {
    [events.CARD_MOVED]: undefined,
    [events.STOCK_ACCESSED]: new Audio(stockAccessed),
    [events.FOUNDATION_FILLED]: new Audio(foundationFilled),
    [events.CARD_PICKED_UP]: undefined,
    [events.TABLEAU_CHANGED]: new Audio(cardMoved),
    [events.CARD_DROPPED]: undefined,
  }

  emit(event: EventValues) {
    const audio = this.files[event];
    if (audio) audio.play();
  }
}

export default new SoundBus();